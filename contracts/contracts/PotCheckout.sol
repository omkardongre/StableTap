// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// Minimal ERC-20 + EIP-2612 surface of Portaldot's Assets precompile.
interface IPermitToken {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
}

/// @title PotCheckout
/// @notice Checkout for one token (on Portaldot: pUSD through the Assets ERC-20 precompile).
/// - Invoice registry with a replay guard: an invoice id is settled at most once per merchant, from any device.
/// - Direct payment, or hold then capture (capture less than held; the rest returns to the payer).
/// - Refunds by the merchant, capped at what was paid.
/// Each payment can be funded with an EIP-2612 permit, so a wallet signs once and sends one transaction.
/// @dev Kept small on purpose: pallet-revive reserves a storage deposit per byte of code and per storage
/// slot. A payment is one 32-byte slot; the merchant is part of the key (merchant-only calls derive the
/// key from msg.sender), and `amount` doubles as what is still refundable.
/// The token must be the runtime precompile (or another token without transfer hooks): it makes no
/// callbacks, so there is no reentrancy path; state is still updated before every transfer.
contract PotCheckout {
    enum Status {
        None,
        Paid,
        Held,
        Captured,
        Voided
    }

    /// Exactly one storage slot: 20 + 7 + 1 + 4 bytes.
    struct Payment {
        address payer;
        uint56 amount; // Held: held. Paid/Captured: still refundable
        Status status;
        uint32 expiresAt; // Held: after this anyone may void the hold
    }

    IPermitToken public immutable token;
    mapping(bytes32 key => Payment) public payments;

    event Paid(bytes32 indexed key, bytes32 indexed invoiceId, address indexed merchant, address payer, uint256 amount);
    event Held(bytes32 indexed key, bytes32 indexed invoiceId, address indexed merchant, address payer, uint256 amount, uint32 expiresAt);
    event Captured(bytes32 indexed key, uint256 captured, uint256 released);
    event Voided(bytes32 indexed key, uint256 released);
    event Refunded(bytes32 indexed key, address indexed payer, uint256 amount);

    error InvoiceAlreadyUsed(bytes32 key);
    error InvoiceExpired();
    error BadAmount();
    error WrongStatus(Status status);
    error HoldNotExpired();
    error TransferFailed();

    constructor(IPermitToken token_) {
        token = token_;
    }

    /// @notice Registry key: invoice ids are scoped per merchant, so nobody can block another shop's id.
    function keyOf(address merchant, bytes32 invoiceId) public pure returns (bytes32) {
        return keccak256(abi.encode(merchant, invoiceId));
    }

    /// @notice Pay an invoice in full before `deadline` (the invoice expiry). Needs an allowance, or use `permitAnd…`.
    function pay(address merchant, bytes32 invoiceId, uint256 amount, uint256 deadline) public returns (bytes32 key) {
        if (block.timestamp > deadline) revert InvoiceExpired();
        key = _open(merchant, invoiceId, amount, Status.Paid, 0);
        emit Paid(key, invoiceId, merchant, msg.sender, amount);
        _pull(msg.sender, merchant, amount);
    }

    /// @notice Hold `amount` here until the merchant captures or voids it, or it expires.
    function hold(address merchant, bytes32 invoiceId, uint256 amount, uint32 expiresAt) public returns (bytes32 key) {
        if (expiresAt <= block.timestamp) revert InvoiceExpired();
        key = _open(merchant, invoiceId, amount, Status.Held, expiresAt);
        emit Held(key, invoiceId, merchant, msg.sender, amount, expiresAt);
        _pull(msg.sender, address(this), amount);
    }

    function permitAndPay(address merchant, bytes32 invoiceId, uint256 amount, uint256 deadline, uint256 permitDeadline, uint8 v, bytes32 r, bytes32 s)
        external
        returns (bytes32)
    {
        _permit(amount, permitDeadline, v, r, s);
        return pay(merchant, invoiceId, amount, deadline);
    }

    function permitAndHold(address merchant, bytes32 invoiceId, uint256 amount, uint32 expiresAt, uint256 permitDeadline, uint8 v, bytes32 r, bytes32 s)
        external
        returns (bytes32)
    {
        _permit(amount, permitDeadline, v, r, s);
        return hold(merchant, invoiceId, amount, expiresAt);
    }

    /// @notice The merchant (caller) takes `amount` (≤ held); the rest returns to the payer in the same call.
    function capture(bytes32 invoiceId, uint256 amount) external {
        bytes32 key = keyOf(msg.sender, invoiceId);
        Payment storage p = payments[key];
        if (p.status != Status.Held) revert WrongStatus(p.status);
        uint256 held = p.amount;
        if (amount == 0 || amount > held) revert BadAmount();
        p.status = Status.Captured;
        p.amount = uint56(amount);
        emit Captured(key, amount, held - amount);
        _send(msg.sender, amount);
        if (held > amount) _send(p.payer, held - amount);
    }

    /// @notice Return a hold in full: the merchant at any time, anyone once it has expired.
    function voidHold(address merchant, bytes32 invoiceId) external {
        bytes32 key = keyOf(merchant, invoiceId);
        Payment storage p = payments[key];
        if (p.status != Status.Held) revert WrongStatus(p.status);
        if (msg.sender != merchant && block.timestamp <= p.expiresAt) revert HoldNotExpired();
        uint256 held = p.amount;
        p.status = Status.Voided;
        p.amount = 0;
        emit Voided(key, held);
        _send(p.payer, held);
    }

    /// @notice The merchant (caller) refunds part or all of what it was paid, from its own balance (needs an allowance).
    function refund(bytes32 invoiceId, uint256 amount) external {
        bytes32 key = keyOf(msg.sender, invoiceId);
        Payment storage p = payments[key];
        if (p.status != Status.Paid && p.status != Status.Captured) revert WrongStatus(p.status);
        if (amount == 0 || amount > p.amount) revert BadAmount();
        p.amount -= uint56(amount);
        emit Refunded(key, p.payer, amount);
        _pull(msg.sender, p.payer, amount);
    }

    function _open(address merchant, bytes32 invoiceId, uint256 amount, Status status, uint32 expiresAt) private returns (bytes32 key) {
        if (merchant == address(0) || amount == 0 || amount > type(uint56).max) revert BadAmount();
        key = keyOf(merchant, invoiceId);
        if (payments[key].status != Status.None) revert InvoiceAlreadyUsed(key);
        payments[key] = Payment(msg.sender, uint56(amount), status, expiresAt);
    }

    /// A front-run permit (someone submits the signature first) leaves the allowance in place,
    /// so only fail when the allowance is actually missing.
    function _permit(uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) private {
        try token.permit(msg.sender, address(this), amount, deadline, v, r, s) {}
        catch {
            if (token.allowance(msg.sender, address(this)) < amount) revert TransferFailed();
        }
    }

    function _pull(address from, address to, uint256 amount) private {
        if (!token.transferFrom(from, to, amount)) revert TransferFailed();
    }

    function _send(address to, uint256 amount) private {
        if (!token.transfer(to, amount)) revert TransferFailed();
    }
}

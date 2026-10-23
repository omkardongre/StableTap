# Indexer on a VM

The indexer is a long-running block follower with a SQLite file, so it needs an always-on host with a disk (not a scale-to-zero service). This setup uses one Google Compute Engine e2-micro (Debian 12), which fits Google Cloud's free tier in us-central1, us-west1 or us-east1 with a 30 GB standard disk. A reserved external IPv4 address may be billed separately.

What `setup-vm.sh` installs:

- Node 24 (NodeSource) and pnpm (corepack); 2 GB swap so installs fit in 1 GB RAM
- the indexer as a systemd service under an unprivileged `stabletap` user, with a read-only filesystem except `/var/lib/stabletap` (the database)
- Caddy as the HTTPS front: certificates are issued and renewed automatically; the indexer only listens on 127.0.0.1
- public config in `/etc/stabletap/indexer.env` (the indexer holds no secrets)

## Create the VM (once)

```bash
P=<project-id>
gcloud services enable compute.googleapis.com iap.googleapis.com --project $P
# SSH only through Identity-Aware Proxy; web ports open to the VM's tag.
gcloud compute firewall-rules delete default-allow-rdp --project $P --quiet
gcloud compute firewall-rules update default-allow-ssh --project $P --source-ranges=35.235.240.0/20
gcloud compute firewall-rules create allow-web --project $P --network=default --rules=tcp:80,tcp:443,udp:443 --target-tags=web
gcloud compute addresses create indexer-ip --project $P --region=us-central1
gcloud compute instances create stabletap-indexer --project $P --zone=us-central1-a \
  --machine-type=e2-micro --image-family=debian-12 --image-project=debian-cloud \
  --boot-disk-size=30GB --boot-disk-type=pd-standard --address=indexer-ip --tags=web \
  --no-service-account --no-scopes --shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring \
  --metadata=enable-oslogin=TRUE
```

## Deploy or update

The hostname must resolve to the VM. Without a domain, `<ip-with-dashes>.sslip.io` resolves to the IP.

```bash
git archive --format=tar.gz -o /tmp/stabletap-src.tar.gz HEAD
gcloud compute scp --project $P --zone us-central1-a --tunnel-through-iap /tmp/stabletap-src.tar.gz deploy/indexer/setup-vm.sh stabletap-indexer:/tmp/
gcloud compute ssh stabletap-indexer --project $P --zone us-central1-a --tunnel-through-iap --command \
  'sudo HOSTNAME=<host> CORS_ORIGINS=https://<web-app-origin> bash /tmp/setup-vm.sh /tmp/stabletap-src.tar.gz'
curl https://<host>/health
```

Re-running the script replaces the code and config and restarts the service; the database in `/var/lib/stabletap` is kept, so indexing resumes at its cursor.

Logs: `sudo journalctl -u stabletap-indexer -f` and `sudo journalctl -u caddy -f`.

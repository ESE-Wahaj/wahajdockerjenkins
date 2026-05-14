output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.wahaj_ec2.id
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.wahaj_ec2.public_ip
}

output "public_dns" {
  description = "Public DNS hostname"
  value       = aws_instance.wahaj_ec2.public_dns
}

output "jenkins_url" {
  description = "Jenkins web UI URL"
  value       = "http://${aws_instance.wahaj_ec2.public_ip}:8080"
}

output "app_url" {
  description = "Web application URL"
  value       = "http://${aws_instance.wahaj_ec2.public_ip}:3000"
}

output "prometheus_url" {
  description = "Prometheus web UI URL"
  value       = "http://${aws_instance.wahaj_ec2.public_ip}:9090"
}

output "grafana_url" {
  description = "Grafana web UI URL"
  value       = "http://${aws_instance.wahaj_ec2.public_ip}:3030"
}

output "k8s_app_url" {
  description = "Kubernetes NodePort URL for the app"
  value       = "http://${aws_instance.wahaj_ec2.public_ip}:30080"
}

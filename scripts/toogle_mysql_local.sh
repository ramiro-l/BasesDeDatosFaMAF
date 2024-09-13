## Intercambiar entre activado y no activo el mysql local
sudo systemctl start mysql   # Activar
sudo systemctl stop mysql    # Desactivar
sudo systemctl restart mysql # Reiniciar mysql local

mysql -h localhost -u root -p # Conectar a mysql local

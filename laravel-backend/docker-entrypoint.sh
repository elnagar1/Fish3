#!/bin/bash
set -e

# Copy .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Generate key if not set
if grep -q "APP_KEY=base64:" .env; then
    echo "App key already set."
else
    echo "Generating app key..."
    php artisan key:generate --force
fi

# Configure Database
# If DB_CONNECTION is sqlite and DB_DATABASE is not set, set it to storage location
if grep -q "DB_CONNECTION=sqlite" .env; then
    if ! grep -q "^DB_DATABASE=" .env; then
        echo "Setting SQLite database path to storage..."
        echo "DB_DATABASE=/var/www/html/storage/database.sqlite" >> .env
    fi
fi

# Create database if not exists
DB_FILE=$(grep "^DB_DATABASE=" .env | cut -d '=' -f2)
if [ -z "$DB_FILE" ]; then
    DB_FILE="/var/www/html/storage/database.sqlite"
fi

# If using default path (database/database.sqlite), changing to storage for persistence if needed
# But asking user to change logic might be too much.
# Let's just create the file where it effectively points.

# Check if this is a fresh database
IS_NEW_DB=false
# Handle Database Setup
# Check if persistent database exists
if [ ! -f "$DB_FILE" ]; then
    echo "No persistent database found."
    
    # Check if we have a seed database in the image (from source code)
    SEED_DB="/var/www/html/database/database.sqlite"
    
    if [ -f "$SEED_DB" ]; then
        echo "Found seed database at $SEED_DB. Copying to persistent storage..."
        cp "$SEED_DB" "$DB_FILE"
    else
        echo "No seed database found. Creating new empty database..."
        touch "$DB_FILE"
        IS_NEW_DB=true
    fi
fi

# Fix permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache "$DB_FILE"
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Seed only if it's a new database
if [ "$IS_NEW_DB" = true ]; then
    echo "Seeding initial data..."
    php artisan db:seed --force
fi

# Start Apache
echo "Starting Apache..."
exec apache2-foreground

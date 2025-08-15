#!/usr/bin/env python3
"""
Setup script for SQLite-based TradeTrack backend
Run this to clean install and setup the backend
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e.stderr}")
        return False

def setup_sqlite_backend():
    """Setup the SQLite-based backend"""
    print("🚀 Setting up TradeTrack Backend with SQLite...\n")
    
    # Step 1: Remove MongoDB packages
    print("1. Removing MongoDB packages...")
    packages_to_remove = ['djongo', 'pymongo']
    for package in packages_to_remove:
        run_command(f"python -m pip uninstall {package} -y", f"Removing {package}")
    
    # Step 2: Install SQLite-compatible packages
    print("\n2. Installing SQLite-compatible packages...")
    if not run_command("python -m pip install -r requirements.txt", "Installing requirements"):
        print("❌ Failed to install requirements. Check your virtual environment.")
        return False
    
    # Step 3: Clean up old database files
    print("\n3. Cleaning up old database files...")
    db_files = ['db.sqlite3', 'db.sqlite3-journal']
    for db_file in db_files:
        if os.path.exists(db_file):
            os.remove(db_file)
            print(f"   Removed {db_file}")
    
    # Step 4: Make migrations
    print("\n4. Creating database migrations...")
    if not run_command("python manage.py makemigrations", "Creating migrations"):
        print("❌ Failed to create migrations.")
        return False
    
    # Step 5: Apply migrations
    print("\n5. Applying migrations to SQLite...")
    if not run_command("python manage.py migrate", "Applying migrations"):
        print("❌ Failed to apply migrations.")
        return False
    
    # Step 6: Create superuser (optional)
    print("\n6. Backend setup complete!")
    print("\n🎯 Next steps:")
    print("   1. Start the server: python manage.py runserver")
    print("   2. Test the API: python test_api.py")
    print("   3. Visit: http://localhost:8000/")
    
    return True

if __name__ == "__main__":
    setup_sqlite_backend() 
#!/bin/bash

# ================= INSTALL FUNCTIONS =================
install_npm(){
    echo "\nInstalling NPM...."
    sudo apt update -y
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 22
    nvm use 22
    node -v
    npm -v

    echo "Installation done. Please restart your terminal to start using Node.js."
}

install_pnpm(){
    echo "\n Installing PNPM...."
    sudo apt update -y
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 22
    nvm use 22
    node -v
    npm -v

    npm install -g pnpm

    pnpm -v || echo "pnpm installation failed."

    echo "Installation done. Please restart your terminal to start using Node.js."
}

install_dbgate(){
    echo "Installing DBGate..."
    wget -qO .dbgate-installer.deb https://github.com/dbgate/dbgate/releases/latest/download/dbgate-latest.deb
    sudo apt update -y
    sudo apt install ./.dbgate-installer.deb -y
    rm .dbgate-installer.deb
}

install_mysql(){
    echo "\n Installing MySQL server..."
    sudo apt update -y
    sudo apt install mysql-server -y
}

select_db(){
    DB_CHOICE=$(whiptail --title "Database Installation" --menu \
    "Choose your installation option:" 10 50 2 \
    "BOTH" "Install both DBGate and MySQL" \
    "MYSQL" "Install only MySQL Server" 3>&1 1>&2 2>&3)

    case $DB_CHOICE in
        "BOTH")
            install_dbgate
            install_mysql
            ;;
        "MYSQL")
            install_mysql
            ;;
        *)
            echo "No valid option selected."
            ;;
    esac
}

install_gh(){
    echo "Installing GitHub CLI...\n"
    (type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
    && sudo mkdir -p -m 755 /etc/apt/keyrings \
    && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg >/dev/null \
    && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && sudo mkdir -p -m 755 /etc/apt/sources.list.d \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
       | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null \
    && sudo apt update \
    && sudo apt install gh -y
}

install_all(){
    install_gh
    install_mysql
    install_npm
}

# ================= MAIN SCRIPT =================
if ! command -v whiptail &>/dev/null; then
    echo "Installing whiptail..."
    sudo apt update && sudo apt install whiptail -y
fi

read -rp "Wanna install all of the dependencies? (Y/n) " choice
choice=${choice:-Y}

if [[ $choice =~ ^[Yy]$ ]]; then
    install_all
else
    # Checklist menu
    OPTIONS=$(whiptail --title "Select Dependencies" --checklist \
    "Use SPACE to select, ENTER to confirm:" 15 50 5 \
    "NODE" "Install Node.js" OFF \
    "DB" "Install DBGate" OFF \
    "GH" "Install GitHub CLI" OFF 3>&1 1>&2 2>&3)

    for opt in $OPTIONS; do
        case $opt in
            \"NODE\")
                PM=$(whiptail --title "Node.js Package Manager" --menu \
                "Choose package manager:" 15 40 2 \
                "NPM" "Install Node.js with npm" \
                "PNPM" "Install Node.js with pnpm" 3>&1 1>&2 2>&3)
                if [[ $PM == "NPM" ]]; then install_npm; else install_pnpm; fi
                ;;
            \"DB\")
                select_db
                ;;
            \"GH\")
                install_gh
                ;;
        esac
    done
fi

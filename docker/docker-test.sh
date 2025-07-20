echo "Eofol6 Docker test"
echo "[1/3] Cloning Eofol6..."
git clone https://github.com/wurducius/eofol6
cd eofol6 || exit
rm ./package-lock.json
echo "[2/3] Installing Eofol6..."
npm i
echo "[3/3] Running Eofol6..."
npm start

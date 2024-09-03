ssh-keygen -t ed25519 -C "joaopsterdev@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
code .ssh
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
gpg --armor --export 0CB76863B6829183
ls

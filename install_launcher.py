#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 🖥️ PORTFOLIO INGRID SINKOVITZ DESKTOP DEPLOY LAUNCHER INSTALLER
# Desenvolvido por Lincoln - Julho 2026

import os
import stat

def install():
    print("🖥️ Inicializando instalação do lançador de Deploy...")
    
    root_dir = "/home/artz/Documentos/Antigravity/site-ingrid-sinkovitz"
    deploy_sh = os.path.join(root_dir, "deploy.sh")
    logo_png = os.path.join(root_dir, "public", "logos", "LogoCirculo.png")
    
    # 1. Tornar o deploy.sh executável
    if os.path.exists(deploy_sh):
        st = os.stat(deploy_sh)
        os.chmod(deploy_sh, st.st_mode | stat.S_IEXEC)
        print("✅ Script 'deploy.sh' marcado como executável com sucesso.")
    else:
        print("❌ Erro: deploy.sh não encontrado!")
        return
        
    # Conteúdo do arquivo .desktop
    # Nota: Terminal=true garante que abrirá um terminal para acompanhar o build e deploy
    desktop_entry = f"""[Desktop Entry]
Version=1.0
Type=Application
Name=Deploy Ingrid Portfolio
Comment=Compila o site e publica no GitHub e Firebase Hosting
Exec={deploy_sh}
Path={root_dir}
Icon={logo_png}
Terminal=true
Categories=Development;
StartupNotify=true
"""

    # 2. Salvar na pasta do sistema (~/.local/share/applications/)
    system_app_dir = "/home/artz/.local/share/applications"
    os.makedirs(system_app_dir, exist_ok=True)
    system_desktop_path = os.path.join(system_app_dir, "deploy-ingrid.desktop")
    
    with open(system_desktop_path, "w", encoding="utf-8") as f:
        f.write(desktop_entry)
    st = os.stat(system_desktop_path)
    os.chmod(system_desktop_path, st.st_mode | stat.S_IEXEC)
    print(f"✅ Lançador de Menu instalado em: {system_desktop_path}")

    # 3. Salvar na Área de Trabalho (Desktop) se existir
    desktop_paths = [
        "/home/artz/Área de Trabalho",
        "/home/artz/Área de trabalho",
        "/home/artz/Desktop",
        "/home/artz/Desktop-Folders"
    ]
    
    for dp in desktop_paths:
        if os.path.exists(dp):
            dest_path = os.path.join(dp, "deploy-ingrid.desktop")
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(desktop_entry)
            st = os.stat(dest_path)
            os.chmod(dest_path, st.st_mode | stat.S_IEXEC)
            print(f"✅ Lançador adicionado à Área de Trabalho: {dest_path}")
            
    print("🎉 Instalação concluída com sucesso! O ícone circular do portfólio agora figura nos seus atalhos de deploy.")

if __name__ == "__main__":
    install()

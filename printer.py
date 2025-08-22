def save_files_data(file_paths, output_file):
    with open(output_file, 'w', encoding='utf-8') as out_file:
        for path in file_paths:
            out_file.write(f"\n\n=== File: {path} ===\n")
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    out_file.write(content)
            except Exception as e:
                out_file.write(f"[Error reading file]: {e}")

if __name__ == "__main__":
    # 🔧 Replace with your actual file paths
    files = [
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\api\interview\[id]\feedback\route.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\api\interview\send video\route.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\interview\new\loading.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\interview\new\page.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\interview\page.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\sign-in\page.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\sign-up\page.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\globals.css",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\layout.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\app\page.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\components\ui\card.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\components\ui\button.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\hooks\use-mobile.tsx",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\hooks\use-toast.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\lib\db.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\lib\utils.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\scripts\schema.sql",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\styles\globals.css",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\.env.example",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\middleware.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\next-env.d.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\next.config.mjs",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\package.json",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\tailwind.config.ts",
        r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\tsconfig.json"
        
        
        
    ]
    
    # 🔧 Output file where results will be saved
    output = r"C:\Users\saisagar\Downloads\ai-mock-interview (1)\output.txt"

    save_files_data(files, output)
    print(f"Data saved to {output}")
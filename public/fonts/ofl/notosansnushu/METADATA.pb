name: "Noto Sans Nushu"
designer: "Google"
license: "OFL"
category: "SANS_SERIF"
date_added: "2020-11-19"
fonts {
  name: "Noto Sans Nushu"
  style: "normal"
  weight: 400
  filename: "NotoSansNushu-Regular.ttf"
  post_script_name: "NotoSansNushu-Regular"
  full_name: "Noto Sans Nushu Regular"
  copyright: "Copyright 2022 The Noto Project Authors (https://github.com/notofonts/nushu)"
}
subsets: "latin"
subsets: "latin-ext"
subsets: "menu"
subsets: "nushu"
source {
  repository_url: "https://github.com/notofonts/nushu"
  commit: "933f7be1e6083e9ead39e560fa0b526d491bec4b"
  config_yaml: "sources/config-sans-nushu.yaml"
  archive_url: "https://github.com/notofonts/nushu/releases/download/NotoSansNushu-v1.003/NotoSansNushu-v1.003.zip"
  files {
    source_file: "OFL.txt"
    dest_file: "OFL.txt"
  }
  files {
    source_file: "DESCRIPTION.en_us.html"
    dest_file: "DESCRIPTION.en_us.html"
  }
  files {
    source_file: "NotoSansNushu/googlefonts/ttf/NotoSansNushu-Regular.ttf"
    dest_file: "NotoSansNushu-Regular.ttf"
  }
  branch: "main"
}
is_noto: true
languages: "mis_Nshu"  # Xiangnan Tuhua
display_name: "Noto Sans Nüshu"
primary_script: "Nshu"

{
  pkgs,
  ...
}:

{
  name = "discord-bot";

  # https://devenv.sh/packages/
  packages = with pkgs; [
    just
  ];

  # https://devenv.sh/languages/
  languages = {
    javascript = {
      enable = true;
      directory = "./bot";
      package = pkgs.nodejs_26;
      npm = {
        enable = true;
        install.enable = true;
      };
    };
    typescript.enable = true;

    python = {
      enable = true;
      directory = "./api";
      version = "3.14";
      venv.enable = true;
      uv = {
        enable = true;
        sync.enable = true;
      };
    };
  };

  # See full reference at https://devenv.sh/reference/options/
}

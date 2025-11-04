{ pkgs, lib, config, inputs, ... }:

{
  name = "discord-bot";

  # https://devenv.sh/packages/
  packages = with pkgs; [ 
    just
  ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    directory = "./bot";
    corepack.enable = true;
    yarn = {
      # enable = true;
      # install.enable = true;
    };
  };
  languages.typescript.enable = true;

  languages.python = {
    enable = true;
    directory = "./api";
    venv = {
      enable = true;
      requirements = ./api/requirements.txt;
    };
  };

  # See full reference at https://devenv.sh/reference/options/
}

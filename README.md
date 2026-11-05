# warm.vodka landing page

## using

```nix
{ inputs, pkgs, ... }:
let
  landingPage =
    inputs.landing-page.packages.${pkgs.stdenv.hostPlatform.system}.default.override {
      title = "website.com";

      links = {
        link1 = "link1.example.com";
        link2 = "link2.example.com";
        link3 = "link3.example.com";
      };

      accountLink = {
        label = "manage your account";
        url = "account.example.com";
      };
      # Or: accountLink = null;
    };
in
{
  services.caddy = {
    enable = true;

    virtualHosts."warm.vodka".extraConfig = ''
      root * ${landingPage}
      file_server
    '';
  };

}
```

## theme

Colours live in `src/style.css`: warm neutral surfaces (`#171416`, `#211d1f`,
`#2b2528`, `#352d31`), pale labels (`#f4e8e8`), secondary text (`#b4a7aa`),
and a separate coral accent (`#ff747e`). The square frame uses a 1px `#3b3336` border.

Service and account links keep pale text on neutral hover, pressed, and keyboard
selection surfaces. Keyboard focus adds a coral outline and side marker;
the outline stays visible above adjacent rows.
Colour feedback takes 120ms and is disabled for reduced-motion preferences.

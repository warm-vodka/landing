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

      # Optional: override any subset of the palette.
      colors = {
        background0 = "#101820";
        accent = "#80cbc4";
        box-border-color = "#567890";
      };
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

The package's `.override` accepts a `colors` attribute set. Only supplied colours
change; the rest inherit the defaults in `site.json`. Local development uses the
same palette, which can also be overridden through `colors` in a `SITE_CONFIG`
JSON file. Values are CSS colour strings, and names match the CSS custom
properties without their `--` prefix.

| Attribute | Default | Use |
| --- | --- | --- |
| `background0` | `#171416` | Page and link background; browser theme colour |
| `background1` | `#211d1f` | Hover and keycap background |
| `background2` | `#2b2528` | WebTUI secondary surface |
| `background3` | `#352d31` | Pressed and keyboard-selection background |
| `foreground0` | `#f4e8e8` | Primary text |
| `foreground1` | `#b4a7aa` | Secondary text |
| `foreground2` | `var(--accent)` | WebTUI tertiary text; follows `accent` by default |
| `accent` | `#ff747e` | Heading, keyboard-focus outline and side marker |
| `box-border-color` | `#3b3336` | Frame and keycap borders |

Service and account links keep primary text on neutral hover, pressed, and
keyboard-selection surfaces. The square frame uses a 1px border, and the
keyboard-focus outline stays visible above adjacent rows.
Colour feedback takes 120ms and is disabled for reduced-motion preferences.

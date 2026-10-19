const links = [...document.querySelectorAll<HTMLAnchorElement>('main a[href]')];
let pendingG = false;

// Keep native links, Tab navigation, and Enter activation intact.
document.addEventListener('keydown', (event) => {
  const target = event.target;
  if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing
    || !(target instanceof HTMLElement) || target.isContentEditable
    || target.closest('input, textarea, select, button, [role="textbox"]')) {
    pendingG = false;
    return;
  }

  // Holding g must not complete the two-key goto command.
  if (event.key === 'g' && event.repeat) {
    event.preventDefault();
    return;
  }

  const index = links.findIndex((link) => link === document.activeElement);
  let next: number;
  if (pendingG) {
    pendingG = false;
    if (event.key === 'g') next = 0;
    else if (event.key === 'e') next = links.length - 1;
    else return; // Includes Escape: cancel goto without moving.
  } else {
    switch (event.key) {
      case 'j':
      case 'ArrowDown':
        next = Math.min(index + 1, links.length - 1);
        break;
      case 'k':
      case 'ArrowUp':
        next = index < 0 ? links.length - 1 : Math.max(index - 1, 0);
        break;
      case 'g':
        event.preventDefault();
        pendingG = true;
        return;
      default:
        return;
    }
  }

  const link = links[next];
  if (!link) return;
  event.preventDefault();
  link.focus({ preventScroll: true });
  link.scrollIntoView({ block: 'nearest' });
});

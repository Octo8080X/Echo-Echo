export function AppFooter() {
  return (
    <footer class="footer mt-4 p-10 bg-neutral text-neutral-content static bottom-0">
      <aside className="items-center">
        <p class="text-3xl">Echo-Echo</p>
        <p>Copyright © 2024 - Octo 3.6</p>
      </aside>

      <nav>
        <h6 class="footer-title">Menu</h6>
        <a class="link link-hover" href="/home">Home</a>
        <a class="link link-hover" href="/recording">Recoding</a>
        <a class="link link-hover" href="/conditions">Conditions</a>
      </nav>
      <nav>
        <h6 class="footer-title">Reference</h6>
        <a
          class="link link-hover"
          target="_brank"
          rel="noopener"
          href="https://fresh.deno.dev/"
        >
          Fresh
        </a>
        <a
          class="link link-hover"
          target="_brank"
          rel="noopener"
          href="https://hono.dev/"
        >
          Hono
        </a>
        <a
          class="link link-hover"
          target="_brank"
          rel="noopener"
          href="https://github.com/muaz-khan/RecordRTC"
        >
          RecordRTC.js
        </a>
        <a
          class="link link-hover"
          target="_brank"
          rel="noopener"
          href="https://deno.com/"
        >
          Deno
        </a>
        <a
          class="link link-hover"
          target="_brank"
          rel="noopener"
          href="https://github.com/Octo8080X/EchoEcho"
        >
          Octo8080X/EchoEcho
        </a>
      </nav>
    </footer>
  );
}

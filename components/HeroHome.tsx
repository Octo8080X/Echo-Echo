export default function HeroHome() {
  return (
    <div class="hero" style="background-image: url(/images/1000007461.jpg);">
      <div class="hero-overlay bg-opacity-40"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="">
          <h1 class="text-5xl font-bold">Welcome `Echo-Echo`</h1>
          <div class="py-3">
            <p class="">
              `Echo-Echo` is a short sound registration service!
            </p>
            <p class="">
              <small>(In one week, it will be removed.)</small>
            </p>
          </div>
          <a class="btn btn-primary" href="/recording">Lets recording!</a>
        </div>
      </div>
    </div>
  );
}

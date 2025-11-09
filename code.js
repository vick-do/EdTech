// Handle smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Navigation scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.remove("bg-transparent", "text-white");
      navbar.classList.add("bg-white", "text-black", "shadow-md");
    } else {
      navbar.classList.remove("bg-white", "text-black", "shadow-md");
      navbar.classList.add("bg-transparent", "text-white");
    }
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navbarHeight = document.getElementById("navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Update active navigation link based on scroll position
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const navbarHeight = document.getElementById("navbar").offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 100;
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-orange-400", "border-orange-500");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("text-orange-400", "border-orange-500");
      }
    });
  });
});

// Handle smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // References
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menu-btn");
  const menuBars = menuBtn ? menuBtn.querySelectorAll("span") : null;

  // Helpers
  const isHamburgerVisible = () => {
    if (!menuBtn) return false;
    const style = window.getComputedStyle(menuBtn);
    return style.display !== "none" && style.visibility !== "hidden";
  };

  const updateHamburgerBars = (scrolled) => {
    if (!menuBars || !isHamburgerVisible()) return;
    menuBars.forEach((span) => {
      if (scrolled) {
        // Navbar is white -> bars should be black
        if (span.classList.contains("bg-white")) {
          span.classList.replace("bg-white", "bg-black");
        } else {
          span.classList.remove("bg-white");
          span.classList.add("bg-black");
        }
      } else {
        // Navbar is transparent -> bars should be white
        if (span.classList.contains("bg-black")) {
          span.classList.replace("bg-black", "bg-white");
        } else {
          span.classList.remove("bg-black");
          span.classList.add("bg-white");
        }
      }
    });
  };

  // Navigation scroll effect (keeps original threshold of 50px)
  const applyNavbarState = () => {
    const scrolled = window.scrollY > 50;
    if (navbar) {
      if (scrolled) {
        navbar.classList.remove("bg-transparent", "text-white");
        navbar.classList.add("bg-white", "text-black", "shadow-md");
      } else {
        navbar.classList.remove("bg-white", "text-black", "shadow-md");
        navbar.classList.add("bg-transparent", "text-white");
      }
    }
    // Only apply hamburger color swap when hamburger is visible (mobile)
    updateHamburgerBars(scrolled);
  };

  // Initial and event bindings
  applyNavbarState();
  window.addEventListener("scroll", applyNavbarState);
  window.addEventListener("resize", () =>
    updateHamburgerBars(window.scrollY > 50)
  );

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

  // ------------------- Homepage Feedback Form -------------------
  
  const DEVICE_ID_KEY = "edtech-device-id";
  const API_URL = "https://edudoc-610o.onrender.com/api/feedback/submit";

  // Get or create device ID
  function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = "device_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  // Map rating values to backend format
  const ratingMap = {
    "very_satisfied": "very satisfied",
    "satisfied": "satisfied",
    "neutral": "neutral",
    "dissatisfied": "dissatisfied",
    "very_dissatisfied": "very dissatisfied"
  };

  // Get form elements
  const feedbackForm = document.getElementById("edtech-feedback-form");
  const feedbackMessage = document.getElementById("feedback-message");
  const feedbackRating = document.getElementById("feedback-rating");
  const submitButton = document.getElementById("submit-button");
  const statusMessage = document.getElementById("status-message");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function(e) {
      e.preventDefault();

      const feedback = feedbackMessage.value.trim();
      const rating = feedbackRating.value;

      // Validate
      if (!feedback) {
        statusMessage.textContent = "Please enter your feedback.";
        statusMessage.className = "text-sm font-medium h-5 text-center md:text-left text-red-600";
        return;
      }

      if (!rating) {
        statusMessage.textContent = "Please select a satisfaction level.";
        statusMessage.className = "text-sm font-medium h-5 text-center md:text-left text-red-600";
        return;
      }

      // Disable button while submitting
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      statusMessage.textContent = "";

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            device_id: getDeviceId(),
            feedback: feedback,
            rating: ratingMap[rating] || "neutral"
          })
        });

        if (response.ok) {
          statusMessage.textContent = "Thank you for your feedback!";
          statusMessage.className = "text-sm font-medium h-5 text-center md:text-left text-green-600";
          feedbackMessage.value = "";
          feedbackRating.value = "";
        } else {
          statusMessage.textContent = "Failed to submit. Please try again.";
          statusMessage.className = "text-sm font-medium h-5 text-center md:text-left text-red-600";
        }
      } catch (error) {
        console.error("Feedback submission error:", error);
        statusMessage.textContent = "Network error. Please try again.";
        statusMessage.className = "text-sm font-medium h-5 text-center md:text-left text-red-600";
      }

      // Re-enable button
      submitButton.disabled = false;
      submitButton.textContent = "Send Feedback";
    });
  }

  // ------------------- end Homepage Feedback Form -------------------
});

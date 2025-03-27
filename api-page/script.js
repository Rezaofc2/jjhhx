document.addEventListener("DOMContentLoaded", async () => {
  const loadingScreen = document.getElementById("loadingScreen")
  const body = document.body
  body.classList.add("no-scroll")

  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle")
  const themeIcon = themeToggle.querySelector("i")

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark")
    themeIcon.classList.remove("fa-moon")
    themeIcon.classList.add("fa-sun")
  }

  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark")

    if (document.documentElement.classList.contains("dark")) {
      themeIcon.classList.remove("fa-moon")
      themeIcon.classList.add("fa-sun")
      localStorage.setItem("theme", "dark")
    } else {
      themeIcon.classList.remove("fa-sun")
      themeIcon.classList.add("fa-moon")
      localStorage.setItem("theme", "light")
    }
  })

  try {
    const settings = await fetch("/src/settings.json").then((res) => res.json())

    const setContent = (id, property, value) => {
      const element = document.getElementById(id)
      if (element) element[property] = value
    }

    const randomImageSrc =
      Array.isArray(settings.header.imageSrc) && settings.header.imageSrc.length > 0
        ? settings.header.imageSrc[Math.floor(Math.random() * settings.header.imageSrc.length)]
        : ""

    const dynamicImage = document.getElementById("dynamicImage")
    if (dynamicImage) {
      dynamicImage.src = randomImageSrc

      const setImageSize = () => {
        dynamicImage.style.height = "auto"
      }

      setImageSize()
      window.addEventListener("resize", setImageSize)
    }

    setContent("page", "textContent", settings.name || "MchaX Api's")
    setContent("header", "textContent", settings.name || "MchaX Api's")
    setContent("name", "textContent", settings.name || "MchaX Api's")
    setContent("version", "textContent", settings.version || "v1.0 Beta")
    setContent("versionHeader", "textContent", settings.header.status || "Online!")
    setContent("description", "textContent", settings.description || "Simple API's")

    const apiLinksContainer = document.getElementById("apiLinks")
    if (apiLinksContainer && settings.links?.length) {
      settings.links.forEach(({ url, name }) => {
        const link = Object.assign(document.createElement("a"), {
          href: url,
          textContent: name,
          target: "_blank",
          className: "api-link",
        })
        apiLinksContainer.appendChild(link)
      })
    }

    // Create collapsible categories
    const apiCategories = document.getElementById("apiCategories")
    settings.categories.forEach((category, categoryIndex) => {
      const categoryId = `category-${categoryIndex}`
      const sortedItems = category.items.sort((a, b) => a.name.localeCompare(b.name))

      // Create category card
      const categoryCard = document.createElement("div")
      categoryCard.className = "category-card"
      categoryCard.dataset.category = category.name.toLowerCase()

      // Create category header
      const categoryHeader = document.createElement("div")
      categoryHeader.className = "category-header"

      // Get a random icon for each category
const icons = [
    "fa-layer-group",
    "fa-code",
    "fa-database",
    "fa-cloud",
    "fa-bolt",
    "fa-server",
    "fa-plug",
    "fa-cogs",
    "fa-home",
    "fa-user",
    "fa-users",
    "fa-user-circle",
    "fa-user-shield",
    "fa-user-cog",
    "fa-user-edit",
    "fa-user-check",
    "fa-user-times",
    "fa-envelope",
    "fa-envelope-open",
    "fa-paper-plane",
    "fa-comment",
    "fa-comments",
    "fa-bell",
    "fa-bell-slash",
    "fa-exclamation-triangle",
    "fa-info-circle",
    "fa-question-circle",
    "fa-check-circle",
    "fa-times-circle",
    "fa-plus-circle",
    "fa-minus-circle",
    "fa-arrow-up",
    "fa-arrow-down",
    "fa-arrow-left",
    "fa-arrow-right",
    "fa-sync",
    "fa-redo",
    "fa-undo",
    "fa-upload",
    "fa-download",
    "fa-folder",
    "fa-folder-open",
    "fa-file",
    "fa-file-alt",
    "fa-file-code",
    "fa-file-excel",
    "fa-file-image",
    "fa-file-video",
    "fa-file-audio",
    "fa-file-archive",
    "fa-trash",
    "fa-edit",
    "fa-save",
    "fa-print",
    "fa-key",
    "fa-lock",
    "fa-unlock",
    "fa-wrench",
    "fa-tools",
    "fa-shopping-cart",
    "fa-credit-card",
    "fa-money-bill",
    "fa-wallet",
    "fa-chart-line",
    "fa-chart-bar",
    "fa-chart-pie",
    "fa-globe",
    "fa-map",
    "fa-map-marker",
    "fa-compass",
    "fa-clock",
    "fa-calendar",
    "fa-calendar-alt",
    "fa-lightbulb",
    "fa-heart",
    "fa-star",
    "fa-thumbs-up",
    "fa-thumbs-down",
    "fa-share",
    "fa-share-alt",
    "fa-link",
    "fa-external-link-alt",
    "fa-search",
    "fa-magnifying-glass",
    "fa-microphone",
    "fa-video",
    "fa-camera",
    "fa-music",
    "fa-gamepad",
    "fa-terminal",
    "fa-bug",
    "fa-code-branch",
    "fa-github",
    "fa-gitlab",
    "fa-bitbucket",
    "fa-facebook",
    "fa-twitter",
    "fa-instagram",
    "fa-youtube",
    "fa-twitch",
    "fa-discord",
    "fa-whatsapp",
    "fa-telegram",
    "fa-linkedin",
    "fa-slack",
    "fa-docker",
    "fa-apple",
    "fa-windows",
    "fa-linux",
    "fa-android",
    "fa-rocket"
];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)]

      categoryHeader.innerHTML = `
        <div class="category-icon">
          <i class="fas ${randomIcon}"></i>
        </div>
        <h3>${category.name}</h3>
        <div class="category-toggle">
          <i class="fas fa-chevron-down"></i>
        </div>
      `

      // Create items container (initially hidden)
      const itemsContainer = document.createElement("div")
      itemsContainer.className = "category-items"
      itemsContainer.id = categoryId

      // Add items to container
      sortedItems.forEach((item) => {
        const itemElement = document.createElement("div")
        itemElement.className = "api-item"
        itemElement.dataset.name = item.name
        itemElement.dataset.desc = item.desc

        itemElement.innerHTML = `
          <div class="api-item-content">
            <div class="api-item-info">
              <h5>${item.name}</h5>
              <p>${item.desc}</p>
            </div>
            <button class="btn-get get-api-btn" data-api-path="${item.path}" data-api-name="${item.name}" data-api-desc="${item.desc}">
              <span>GET</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        `

        itemsContainer.appendChild(itemElement)
      })

      // Add event listener to toggle category
      categoryHeader.addEventListener("click", () => {
        categoryCard.classList.toggle("active")

        const chevron = categoryHeader.querySelector(".fa-chevron-down")
        if (categoryCard.classList.contains("active")) {
          itemsContainer.style.maxHeight = `${itemsContainer.scrollHeight}px`
          chevron.style.transform = "rotate(180deg)"
        } else {
          itemsContainer.style.maxHeight = "0"
          chevron.style.transform = "rotate(0deg)"
        }
      })

      // Append elements to category card
      categoryCard.appendChild(categoryHeader)
      categoryCard.appendChild(itemsContainer)

      // Append category card to categories container
      apiCategories.appendChild(categoryCard)
    })

    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase()
      const categoryCards = document.querySelectorAll(".category-card")

      categoryCards.forEach((categoryCard) => {
        const categoryName = categoryCard.dataset.category
        const apiItems = categoryCard.querySelectorAll(".api-item")
        let hasVisibleItems = false

        apiItems.forEach((item) => {
          const name = item.getAttribute("data-name").toLowerCase()
          const desc = item.getAttribute("data-desc").toLowerCase()
          const isVisible = name.includes(searchTerm) || desc.includes(searchTerm)

          item.style.display = isVisible ? "" : "none"
          if (isVisible) hasVisibleItems = true
        })

        // Show/hide category based on whether it has visible items
        categoryCard.style.display = hasVisibleItems || categoryName.includes(searchTerm) ? "" : "none"

        // If search term exists and category has visible items, expand it
        if (searchTerm && hasVisibleItems) {
          categoryCard.classList.add("active")
          const itemsContainer = categoryCard.querySelector(".category-items")
          const chevron = categoryCard.querySelector(".fa-chevron-down")
          itemsContainer.style.maxHeight = `${itemsContainer.scrollHeight}px`
          chevron.style.transform = "rotate(180deg)"
        } else if (!searchTerm) {
          // If search term is cleared, collapse all categories
          categoryCard.classList.remove("active")
          const itemsContainer = categoryCard.querySelector(".category-items")
          const chevron = categoryCard.querySelector(".fa-chevron-down")
          itemsContainer.style.maxHeight = "0"
          chevron.style.transform = "rotate(0deg)"
        }
      })
    })

    let bootstrapModal // Declare bootstrapModal here

    document.addEventListener("click", (event) => {
      if (
        !event.target.classList.contains("get-api-btn") &&
        !event.target.parentElement.classList.contains("get-api-btn")
      )
        return

      const target = event.target.classList.contains("get-api-btn") ? event.target : event.target.parentElement
      const { apiPath, apiName, apiDesc } = target.dataset
      bootstrapModal = new bootstrap.Modal(document.getElementById("apiResponseModal")) // Initialize bootstrapModal here
      const modalRefs = {
        label: document.getElementById("apiResponseModalLabel"),
        desc: document.getElementById("apiResponseModalDesc"),
        content: document.getElementById("apiResponseContent"),
        endpoint: document.getElementById("apiEndpoint"),
        spinner: document.getElementById("apiResponseLoading"),
        queryInputContainer: document.getElementById("apiQueryInputContainer"),
        submitBtn: document.getElementById("submitQueryBtn"),
      }

      modalRefs.label.textContent = apiName
      modalRefs.desc.textContent = apiDesc
      modalRefs.content.textContent = ""
      modalRefs.endpoint.textContent = ""
      modalRefs.spinner.classList.add("d-none")
      modalRefs.content.classList.add("d-none")
      modalRefs.endpoint.classList.add("d-none")

      modalRefs.queryInputContainer.innerHTML = ""
      modalRefs.submitBtn.classList.add("d-none")

      const baseApiUrl = `${window.location.origin}${apiPath}`
      const params = new URLSearchParams(apiPath.split("?")[1])
      const hasParams = params.toString().length > 0

      // Find the current API item to check for optional parameters
      const currentItem = settings.categories
        .flatMap((category) => category.items)
        .find((item) => item.path === apiPath)

      // Get optional parameters if they exist
      const optionalParams = currentItem?.optionalParams || []

      if (hasParams) {
        const paramContainer = document.createElement("div")
        paramContainer.className = "param-container"

        const paramsArray = Array.from(params.keys())

        // Get optional descriptions if they exist
        const optionDesc = currentItem?.optionDesc || {}

        paramsArray.forEach((param, index) => {
          const paramGroup = document.createElement("div")
          paramGroup.className = index < paramsArray.length - 1 ? "mb-3" : ""

          const isOptional = optionalParams.includes(param)
          const paramDesc = optionDesc[param] || null

          const label = document.createElement("label")
          label.className = "form-label mb-1"
          label.innerHTML = `Enter ${param}${isOptional ? ' <span class="text-muted">(optional)</span>' : ""}`

          const inputField = document.createElement("input")
          inputField.type = "text"
          inputField.className = "form-control"
          inputField.placeholder = `Enter ${param}${isOptional ? " (optional)" : ""}`
          inputField.dataset.param = param
          inputField.dataset.optional = isOptional ? "true" : "false"

          inputField.required = !isOptional
          inputField.addEventListener("input", validateInputs)

          paramGroup.appendChild(label)
          paramGroup.appendChild(inputField)

          // Add parameter description if available
          if (paramDesc) {
            const descriptionEl = document.createElement("div")
            descriptionEl.className = "param-description"
            descriptionEl.innerHTML = `<small class="text-muted">Options: ${paramDesc}</small>`
            paramGroup.appendChild(descriptionEl)
          }

          paramContainer.appendChild(paramGroup)
        })

        if (currentItem && currentItem.innerDesc) {
          const innerDescDiv = document.createElement("div")
          innerDescDiv.className = "text-muted mt-3"
          innerDescDiv.style.fontSize = "13px"
          innerDescDiv.innerHTML = currentItem.innerDesc.replace(/\n/g, "<br>")
          paramContainer.appendChild(innerDescDiv)
        }

        modalRefs.queryInputContainer.appendChild(paramContainer)
        modalRefs.submitBtn.textContent = "Execute" // Change button text to Execute
        modalRefs.submitBtn.classList.remove("d-none")

        // Enable submit button by default if all required fields are valid
        validateInputs()

        modalRefs.submitBtn.onclick = async () => {
          const inputs = modalRefs.queryInputContainer.querySelectorAll("input")
          const newParams = new URLSearchParams()
          let isValid = true

          inputs.forEach((input) => {
            const isOptional = input.dataset.optional === "true"

            if (!isOptional && !input.value.trim()) {
              isValid = false
              input.classList.add("is-invalid")
            } else {
              input.classList.remove("is-invalid")
              // Only add parameter if it has a value (even for optional fields)
              if (input.value.trim()) {
                newParams.append(input.dataset.param, input.value.trim())
              }
            }
          })

          if (!isValid) {
            modalRefs.content.textContent = "Please fill in all required fields."
            modalRefs.content.classList.remove("d-none")
            return
          }

          const apiUrlWithParams = `${window.location.origin}${apiPath.split("?")[0]}?${newParams.toString()}`

          modalRefs.queryInputContainer.innerHTML = ""
          modalRefs.submitBtn.classList.add("d-none")
          handleApiRequest(apiUrlWithParams, modalRefs, apiName)
        }
      } else {
        handleApiRequest(baseApiUrl, modalRefs, apiName)
      }

      bootstrapModal.show()
    })

    function validateInputs() {
      const submitBtn = document.getElementById("submitQueryBtn")
      const inputs = document.querySelectorAll(".param-container input")

      // Check if all required inputs (non-optional) have values
      const isValid = Array.from(inputs).every((input) => {
        const isOptional = input.dataset.optional === "true"
        return isOptional || input.value.trim() !== ""
      })

      submitBtn.disabled = !isValid
    }

    // Find the handleApiRequest function and modify it
    function handleApiRequest(apiUrl, modalRefs, apiName) {
      modalRefs.spinner.classList.remove("d-none")
      modalRefs.content.classList.add("d-none")

      // Add the Direct API Access header and endpoint display before making the request
      modalRefs.endpoint.innerHTML = `<div class="direct-api-label">Direct API Access</div>${apiUrl}`
      modalRefs.endpoint.classList.remove("d-none")

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const contentType = response.headers.get("Content-Type")
          if (contentType && contentType.startsWith("image/")) {
            return response.blob().then((blob) => {
              const imageUrl = URL.createObjectURL(blob)

              const img = document.createElement("img")
              img.src = imageUrl
              img.alt = apiName
              img.style.maxWidth = "100%"
              img.style.height = "auto"
              img.style.borderRadius = "10px"
              img.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"

              modalRefs.content.innerHTML = '<div class="result-header">Result</div>'
              modalRefs.content.appendChild(img)
            })
          } else {
            return response.json().then((data) => {
              modalRefs.content.innerHTML = '<div class="result-header">Result</div>'
              modalRefs.content.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`
            })
          }
        })
        .catch((error) => {
          modalRefs.content.innerHTML = `<div class="result-header">Error</div><pre>${error.message}</pre>`
        })
        .finally(() => {
          modalRefs.spinner.classList.add("d-none")
          modalRefs.content.classList.remove("d-none")
        })
    }
  } catch (error) {
    console.error("Error loading settings:", error)
  } finally {
    setTimeout(() => {
      loadingScreen.style.display = "none"
      body.classList.remove("no-scroll")

      // Add entrance animations after loading
      const categoryCards = document.querySelectorAll(".category-card")
      categoryCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("show")
        }, 100 * index)
      })
    }, 1500)
  }
})

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  const navbarBrand = document.querySelector(".navbar-brand")
  if (window.scrollY > 0) {
    navbarBrand.classList.add("visible")
    navbar.classList.add("scrolled")
  } else {
    navbarBrand.classList.remove("visible")
    navbar.classList.remove("scrolled")
  }
})


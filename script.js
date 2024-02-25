function numberBtn() {
    localStorage.setItem("raffleType", "n")

    window.location.assign("numeros.html")
}

function wordBtn() {
    localStorage.setItem("raffleType", "w")

    window.location.assign("palavras.html")
}

const optionsInput = document.getElementById('input')

function separateOptions() {
    const options = optionsInput.value.split(",")

    return options
}

function showMessage(message, color, borderColor) {
    const msgBox = document.getElementById('message')

    msgBox.style.backgroundColor = color
    msgBox.style.border = `solid 1px ${borderColor}`
    msgBox.innerHTML = message

    $("#message").stop()
    $("#message").stop(true, true)
    $("#message").slideDown(80)
    $("#message").delay(3000)
    $("#message").fadeOut(400)
}

const quantityInputWords = document.getElementById('quantityInputWords')

function limitQuantityWords() {
    const optionsQuantity = separateOptions().length

    if (quantityInputWords.value > optionsQuantity) {
        quantityInputWords.value = optionsQuantity

        showMessage("Não é possível sortear uma quantidade maior de opções do que a quantidade escrita!", "#FFDEDE", "#300000")
    }

    localStorage.setItem("quantityWords", quantityInputWords.value)
}

function pluralWords() {
    const pluralWords = document.getElementById('pluralWords')

    if (quantityInputWords.value > 1) {
        pluralWords.innerHTML = "opções da lista acima"
    } else {
        pluralWords.innerHTML = "opção da lista acima"
    }
}

function raffleWords(options, optionsQuantity) {
    const uniqueOptions = new Set(options)

    if (quantityInputWords.value > uniqueOptions.size) {
        showMessage("Alguma opção foi repetida!", "#FFDEDE", "#300000")
    } else {
        const raffledOptions = new Set()

        while (raffledOptions.size < quantityInputWords.value) {
            let randomIndex = Math.floor(Math.random() * optionsQuantity)
            let raffled = options[randomIndex]
            raffledOptions.add(raffled)
        }

        return [...raffledOptions]
    }
}

function btnClickWords() {
    const options = separateOptions()
    const optionsQuantity = separateOptions().length

    if (optionsInput.value === "") {
        showMessage("Insira alguma opção para ser sorteada!", "#FFDEDE", "#300000")
    } else if (optionsQuantity === 1) {
        showMessage("Insira pelo menos 2 opções para sortear!", "#FFDEDE", "#300000")
    } else {
        const raffledOptions = raffleWords(options, optionsQuantity)

        if (raffledOptions.length != 0) {
            localStorage.setItem("raffledOptions", JSON.stringify(raffledOptions))
            localStorage.setItem("optionsQuantity", optionsQuantity)

            window.location.assign("sorteio.html")
        }
    }
}

const quantityInputNumbers = document.getElementById('quantityInputNumbers')

function limitQuantityNumbers() {
    const min = document.getElementById('minNumber')
    const max = document.getElementById('maxNumber')

    if (max.value === min.value) {
        max.value++

        showMessage("Os limites do número não pode ser iguais!", "#FFDEDE", "#300000")
    }

    const quantityNumbers = Math.abs(max.value - min.value)

    if (quantityInputNumbers.value > quantityNumbers) {
        quantityInputNumbers.value = quantityNumbers

        showMessage("Não é possível sortear uma quantidade de números maior do que a do limite delimitado!", "#FFDEDE", "#300000")
    }

    localStorage.setItem("quantityNumbers", quantityInputNumbers.value)
}

function pluralNumbers() {
    const pluralNumbers = document.getElementById('pluralNumbers')

    if (quantityInputNumbers.value > 1) {
        pluralNumbers.innerHTML = "números"
    } else {
        pluralNumbers.innerHTML = "número"
    }
}

function raffleNumbers(max, min) {
    let raffledNumbers = new Set()

    while (raffledNumbers.size < quantityInputNumbers.value) {
        min = Math.ceil(min)
        max = Math.floor(max)
        let random = Math.floor(Math.random() * (max - min + 1)) + min
        raffledNumbers.add(random)
    }

    raffledNumbers = [...raffledNumbers]

    return raffledNumbers
}

function btnClickNumbers() {
    const max = document.getElementById('maxNumber')
    const min = document.getElementById('minNumber')

    if (quantityInputNumbers.value < 1) {
        showMessage("Pelo menos um número deve ser sorteado!", "#FFDEDE", "#300000")
    } else {
        if (parseFloat(min.value) > parseFloat(max.value)) {
            let aux = min.value
            min.value = max.value
            max.value = aux

            showMessage("Ordem dos limites invertida!", "#DEFFDE", "#003000")

            const interval = setInterval(() => {
                validateClickNumbers(max, min)

                clearInterval(interval)
            }, 1000)
        } else {
            validateClickNumbers(max, min)
        }

        localStorage.setItem("maxNumber", max.value)
        localStorage.setItem("minNumber", min.value)
    }
}

function validateClickNumbers(max, min) {
    const raffledNumbers = raffleNumbers(max.value, min.value)
    localStorage.setItem("raffledNumbers", JSON.stringify(raffledNumbers))

    window.location.assign("sorteio.html")
}

function countDown() {
    const countdown = document.getElementById('countdown')
    let counter = 3

    const interval = setInterval(function () {
        countdown.innerHTML = counter--

        $("#countdown").fadeIn(300)
        $("#countdown").delay(400)
        $("#countdown").fadeOut(300)

        if (counter === 0) {
            clearInterval(interval)
            showResult()
        }
    }, 1000)
}

function showResult() {
    const raffleType = localStorage.getItem("raffleType")
    const resultMessage = document.getElementById('resultMessage')

    if (raffleType === "w") {
        const quantityWords = localStorage.getItem("quantityWords")

        if (quantityWords > 1) {
            resultMessage.innerHTML = `Sorteadas ${quantityWords} opções:`
        } else {
            resultMessage.innerHTML = `Sorteada 1 opção:`
        }

        const raffledOptions = JSON.parse(localStorage.getItem("raffledOptions"))

        for (let i = 0; i < quantityWords; i++) {
            const results = document.createElement("button")
            results.innerHTML = raffledOptions[i]
            results.classList.add("result")
            results.addEventListener("click", copyText)

            const resultDiv = document.querySelector(".result-container")
            resultDiv.appendChild(results)
        }

        $("#resultMessage").delay(1000)
        $("#resultMessage").slideDown(1500)
        $(".result").delay(2000)
        $(".result").fadeIn(1000)

    } else if (raffleType === "n") {
        const quantityNumbers = localStorage.getItem("quantityNumbers")

        if (quantityNumbers > 1) {
            resultMessage.innerHTML = `Sorteados ${quantityNumbers} números:`
        } else {
            resultMessage.innerHTML = `Sorteado 1 número:`
        }

        const raffledNumbers = JSON.parse(localStorage.getItem("raffledNumbers"))

        for (let i = 0; i < quantityNumbers; i++) {
            const results = document.createElement("button")
            results.innerHTML = raffledNumbers[i]
            results.classList.add("result")
            results.addEventListener("click", copyText)

            const resultDiv = document.querySelector(".result-container")
            resultDiv.appendChild(results)
        }

        $("#resultMessage").delay(1000)
        $("#resultMessage").slideDown(1500)
        $(".result").delay(2000)
        $(".result").fadeIn(1000)
    }

    const date = moment().format("DD/MM/YYYY HH:mm:ss")

    $("#date").delay(2500)
    $("#date").slideDown(1000)
    document.getElementById('date').innerHTML = `Data do sorteio:<br>${date}`

    if (raffleType === "w") {
        const optionsQuantity = localStorage.getItem("optionsQuantity")

        $("#quantity").delay(2500)
        $("#quantity").slideDown(1000)
        document.getElementById('quantity').innerHTML = `Quantidade de opções:<br>${optionsQuantity}`
    } else if (raffleType === "n") {
        const max = localStorage.getItem("maxNumber")
        const min = localStorage.getItem("minNumber")

        $("#quantity").delay(2500)
        $("#quantity").slideDown(1000)
        document.getElementById('quantity').innerHTML = `Números entre:<br>${min} e ${max}`
    }

    $("#back").delay(2500)
    $("#back").slideDown(1000)
    $("#repeat").delay(2500)
    $("#repeat").slideDown(1000)
}

async function copyText() {
    const raffleType = localStorage.getItem("raffleType")

    if (raffleType === "w") {
        const text = JSON.parse(localStorage.getItem("raffledOptions"))

        await navigator.clipboard.writeText(text)
    } else if (raffleType === "n") {
        const text = JSON.parse(localStorage.getItem("raffledNumbers"))

        await navigator.clipboard.writeText(text)
    }
    
    showMessage("Sorteio copiado com sucesso!", "#DEFFDE", "#003000")
}

function goBack() {
    window.location.assign("index.html")
}

function repeat() {
    window.location.href = "javascript:history.back()"
}
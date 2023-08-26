window.addEventListener('DOMContentLoaded', (event) => {
    getVisitCount();
})

const functionApi = 'http://localhost:7071/api/httpTrigger1'
const getVisitCount = () => {
    let count = 0
    fetch(functionApi)
        .then(response => {
            return response.json()
        }).then(response => {
            console.log("Website called function API.")
            count = response.count
            document.getElementById("counter").innerText = count

        }
    ).catch(error => {
        console.error(error)
    })


    return count;
}

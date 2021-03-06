$(function () {
    let responseResult;
    $.ajax({
        method: "POST",
        async: false,
        url: "/api/statistics",
        error: function (error) {
            console.log(error);
        },
        success: function (response) {
            responseResult = response;
        }
    });

    const a = new Chart(document.getElementById("pie-chart"), {
        type: "pie",
        data: {
            labels: responseResult.labelPie,
            datasets: [ {
                label: "Population (millions)",
                backgroundColor: [ "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#c70850" ],
                data: responseResult.dataPie
            } ]
        },
        options: {
            title: {
                display: true,
                text: "MOST USED CATEGORIES FOR SURVEYS"
            }
        }
    });
    const b = new Chart(document.getElementById("chart2"), {
        type: "doughnut",
        data: {
            labels: responseResult.labelDonut,
            datasets: [ {
                label: "Population (millions)",
                backgroundColor: [ "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#c70850" ],
                data: responseResult.dataDonut
            } ]
        },
        options: {
            title: {
                display: true,
                text: "MOST USED TYPES OF SURVEYS"
            }
        }
    });

    const bar = new Chart(document.getElementById("chart3"), {
        type: "bar",
        data: {
            labels: responseResult.labelBar,
            datasets: [ {
                label: "Submitted surveys",
                backgroundColor: [ "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850" ],
                data: responseResult.dataBar
            } ]
        },
        options: {
            scales: {
                yAxes: [ {
                    display: true,
                    ticks: {
                        suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true // minimum value will be 0.
                    }
                } ]
            },

            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Submitted surveys in dates"
            }
        }
    });
    const barDays = new Chart(document.getElementById("chart4"), {
        type: "bar",
        data: {
            labels: responseResult.dataBarDay,
            datasets: [ {
                label: "Submitted surveys of day of week",
                backgroundColor: [ "red", "yellow", "#3cba9f", "#e8c3b9", "#c45850" ],
                data: responseResult.labelBarDay
            } ]
        },
        options: {
            scales: {
                yAxes: [ {
                    display: true,
                    ticks: {
                        suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true // minimum value will be 0.
                    }
                } ]
            },

            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Submitted surveys in day of week"
            }
        }
    });
});

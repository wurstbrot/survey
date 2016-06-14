jQuery(function ($) {
    var chartCounter = 0;

    function extractQuestionAndProperty(name) {
        var bracketsStart = name.indexOf("[");
        var question = name.substr(0, bracketsStart - 1);
        var property = name.substr(bracketsStart + 1, name.length - bracketsStart - 2);
        return {'question': question, 'property': property};
    }

    var answerOptions = {}
    answerOptions["Wie häufig nutzen Sie die folgenden Techniken in Ihrer täglichen Arbeit?"] = new Array("Gar nicht / Sehr gering", "Gering", "Mittel", "Hoch", "Sehr hoch", "Bedeutung unbekannt", "Keine Antwort");
    answerOptions["Bitte bewerten Sie die Wichtigkeit der folgenden Eigenschaften Ihrer in Produktion befindlichen Systeme und Anwendungen."] = answerOptions["Wie häufig nutzen Sie die folgenden Techniken in Ihrer täglichen Arbeit?"];
    answerOptions["Bitte bewerten Sie die Wichtigkeit der folgenden Modelle und Konzepte in Ihrer täglichen Arbeit."] = answerOptions["Wie häufig nutzen Sie die folgenden Techniken in Ihrer täglichen Arbeit?"];
    answerOptions["Bitte bewerten Sie den Stellenwert der folgenden Tests in Ihrer täglichen Arbeit."] = new Array("Gar keiner / Sehr gering", "Gering", "Mittel", "Hoch", "Sehr hoch", "Bedeutung unbekannt", "Keine Antwort");
    answerOptions["Über wie viel Wissen verfügen Sie in den folgenden Bereichen?"] = new Array("Keines / Sehr gering", "Gering", "Mittel", "Hoch", "Sehr hoch", "Bedeutung unbekannt", "Keine Antwort");
    answerOptions["Bitte bewerten Sie den Einfluss der folgenden Techniken und Modelle auf Ihre tägliche Arbeit."] = new Array("Sehr negativ", "Negativ", "Kein Einfluss", "Positiv", "Sehr positiv", "Bedeutung unbekannt", "Keine Antwort");

    d3.csv("survey_results.csv", function (data) {
        var dataWithCount = {};
        for (var key in data[0]) {
            if (key == "Antwort ID") continue;

            var questonAndProperty = extractQuestionAndProperty(key);
            if (questonAndProperty.question == "") continue;


            for (var i in data) {
                var answer = data[i][key];
                if (answer == "") {
                    answer = "Keine Antwort"
                }
                if (typeof answerOptions[questonAndProperty['question']] == "undefined") {
                    continue;
                }


                if (typeof dataWithCount[questonAndProperty['question']] == "undefined") {
                    dataWithCount[questonAndProperty['question']] = {}
                }
                if (typeof dataWithCount[questonAndProperty['question']][questonAndProperty['property']] == "undefined") {
                    dataWithCount[questonAndProperty['question']][questonAndProperty['property']] = {}
                    for (var preparedAnswer in answerOptions[questonAndProperty['question']]) {
                        dataWithCount[questonAndProperty['question']][questonAndProperty['property']][answerOptions[questonAndProperty['question']][preparedAnswer]] = 0;
                    }
                    console.log(dataWithCount)
                }
                if (typeof dataWithCount[questonAndProperty['question']][questonAndProperty['property']][answer] == "undefined") {
                    //dataWithCount[questonAndProperty['question']][questonAndProperty['property']][answer] = 0;
                    console.log("err");
                }

                dataWithCount[questonAndProperty['question']][questonAndProperty['property']][answer] = dataWithCount[questonAndProperty['question']][questonAndProperty['property']][answer] + 1;
            }
        }
        var q = new Array();

        for (var question in dataWithCount) {
            var dataWithPreparedValues = new Array();

            var questionData = dataWithCount[question];
            for (var property in questionData) {
                var dataWithPreparedValue = {};
                var answers = questionData[property];


                var answerValues = new Array();
                for (var answerKey in answers) {
                    var key = answerKey;
                    answerValues.push(answers[answerKey]);
                }
                for (var i in answerOptions[question]) {
                    dataWithPreparedValue[answerOptions[question][i]] = {
                        value: 0
                        //,uncertainty: standardDeviation(answerValues)
                    };
                }

                dataWithPreparedValue['Name'] = property;


                for (var answerKey in answers) {
                    var key = answerKey;
                    if (answerKey == "") {
                        key = "Keine Antwort"
                    }

                    dataWithPreparedValue[key]['value'] = answers[answerKey];
                }
                dataWithPreparedValues.push(dataWithPreparedValue);
            }
            for (var question in dataWithPreparedValues) {
                for (var property in dataWithPreparedValues[question]) {

                }
                var id = "containerBarchart" + chartCounter++;
                $("body").append("<h1>" + question + "</h1><div id='" + id + "'></div>");
                var chart,
                    width = 400,
                    bar_height = 20,
                    height = bar_height * names.length;


                var gap = 2;
                // redefine y for adjusting the gap
                y = d3.scale.ordinal()
                    .domain(hotdogs)
                    .rangeBands([0, (bar_height + 2 * gap) * names.length]);


                chart = d3.select($("#" + id)[0])
                    .append('svg')
                    .attr('class', 'chart')
                    .attr('width', left_width + width + 40)
                    .attr('height', (bar_height + gap * 2) * names.length + 30)
                    .append("g")
                    .attr("transform", "translate(10, 20)");

                chart.selectAll("line")
                    .data(x.ticks(d3.max(hotdogs)))
                    .enter().append("line")
                    .attr("x1", function (d) {
                        return x(d) + left_width;
                    })
                    .attr("x2", function (d) {
                        return x(d) + left_width;
                    })
                    .attr("y1", 0)
                    .attr("y2", (bar_height + gap * 2) * names.length);

                chart.selectAll(".rule")
                    .data(x.ticks(d3.max(hotdogs)))
                    .enter().append("text")
                    .attr("class", "rule")
                    .attr("x", function (d) {
                        return x(d) + left_width;
                    })
                    .attr("y", 0)
                    .attr("dy", -6)
                    .attr("text-anchor", "middle")
                    .attr("font-size", 10)
                    .text(String);

                chart.selectAll("rect")
                    .data(hotdogs)
                    .enter().append("rect")
                    .attr("x", left_width)
                    .attr("y", function (d) {
                        return y(d) + gap;
                    })
                    .attr("width", x)
                    .attr("height", bar_height);

                chart.selectAll("text.score")
                    .data(hotdogs)
                    .enter().append("text")
                    .attr("x", function (d) {
                        return x(d) + left_width;
                    })
                    .attr("y", function (d, i) {
                        return y(d) + y.rangeBand() / 2;
                    })
                    .attr("dx", -5)
                    .attr("dy", ".36em")
                    .attr("text-anchor", "end")
                    .attr('class', 'score')
                    .text(String);

                chart.selectAll("text.name")
                    .data(names)
                    .enter().append("text")
                    .attr("x", left_width / 2)
                    .attr("y", function (d, i) {
                        return y(hotdogs[i]) + y.rangeBand() / 2;
                    })
                    .attr("dy", ".36em")
                    .attr("text-anchor", "middle")
                    .attr('class', 'name')
                    .text(String);
                displayTable(dataWithCount[question]);
            }
        }

    })


    var chart,
        width = 400,
        bar_height = 20,
        height = bar_height * names.length;


    var gap = 2;
    // redefine y for adjusting the gap
    y = d3.scale.ordinal()
        .domain(hotdogs)
        .rangeBands([0, (bar_height + 2 * gap) * names.length]);


    chart = d3.select($("#step-5")[0])
        .append('svg')
        .attr('class', 'chart')
        .attr('width', left_width + width + 40)
        .attr('height', (bar_height + gap * 2) * names.length + 30)
        .append("g")
        .attr("transform", "translate(10, 20)");

    chart.selectAll("line")
        .data(x.ticks(d3.max(hotdogs)))
        .enter().append("line")
        .attr("x1", function (d) {
            return x(d) + left_width;
        })
        .attr("x2", function (d) {
            return x(d) + left_width;
        })
        .attr("y1", 0)
        .attr("y2", (bar_height + gap * 2) * names.length);

    chart.selectAll(".rule")
        .data(x.ticks(d3.max(hotdogs)))
        .enter().append("text")
        .attr("class", "rule")
        .attr("x", function (d) {
            return x(d) + left_width;
        })
        .attr("y", 0)
        .attr("dy", -6)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .text(String);

    chart.selectAll("rect")
        .data(hotdogs)
        .enter().append("rect")
        .attr("x", left_width)
        .attr("y", function (d) {
            return y(d) + gap;
        })
        .attr("width", x)
        .attr("height", bar_height);

    chart.selectAll("text.score")
        .data(hotdogs)
        .enter().append("text")
        .attr("x", function (d) {
            return x(d) + left_width;
        })
        .attr("y", function (d, i) {
            return y(d) + y.rangeBand() / 2;
        })
        .attr("dx", -5)
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'score')
        .text(String);

    chart.selectAll("text.name")
        .data(names)
        .enter().append("text")
        .attr("x", left_width / 2)
        .attr("y", function (d, i) {
            return y(hotdogs[i]) + y.rangeBand() / 2;
        })
        .attr("dy", ".36em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(String);

}(jQuery));


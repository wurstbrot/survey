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

function standardDeviationForData(data) {
    var answerValues = new Array();
    for (var answerKey in data) {
        var key = answerKey;
        answerValues.push(data[answerKey]);
    }

    var singleAnswerValues = new Array();
    var answerOptionBucket = 1;
    for(var i in answerValues) {
        for(var j = 0; j < parseInt(answerValues[i]); j++ ) {
            singleAnswerValues.push(answerOptionBucket);
        }
        answerOptionBucket++;
    }

    return standardDeviation(singleAnswerValues);
}

function standardDeviation(values) {
    var avg = average(values);

    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function average(data) {
    var sum = 0
    /*data.reduce(function(sum, value){
     return sum + value;
     }, 0);
     */
    for (var i in data) {
        sum = sum + parseInt(data[i]);
    }
    var avg = sum / data.length;
    return avg;
}
function averageForData(data) {
    var plainSum = 0
    var multipliedSum = 0

    var i = 1;
    for (var answerName in data) {
        plainSum = plainSum + (parseInt(data[answerName]));
        multipliedSum = multipliedSum + (parseInt(data[answerName])*i);
        if (++i == 6) {
            break;
        }
    }
    var avg = multipliedSum / plainSum;
    return avg;
}
function calculateAvgForYears(data) {
    var values = new Array();
    var totalAvg = 0;
    for (var key in data) {
        var years = data[key]["Über wie viele Jahre Berufserfahrung verfügen Sie?"];
        if (isNaN(years)) {
            years = 0;
        }
        values.push(years);
    }
    return "X";

}

function round(x) {
    return parseFloat(x).toFixed(2).replace(".", ",");
}
function getPercentages(data) {
    var percentages = {}
    for (var question in data) {
        percentages[question] = {}


        var keys = Object.keys(data[question]);
        var sum = 0;
        for (var answerName in data[question]) {
            var value = parseInt(data[question][answerName]);
            sum = sum + value
        }
        var dataValue = getDataValueForRow(data[question]);
        var avg = averageForData(data[question]);
        var std = standardDeviationForData(data[question]);

        for (var answerName in data[question]) {
            var value = parseInt(data[question][answerName]);
            percentages[question][answerName] = {
                'value': value,
                'percentage': round((value / sum) * 100),
                'dataValue': round(dataValue),
                'avg': round(avg),
                'standardDeviation': round(std)
            }
        }
    }
    return percentages;
}
function getDataValueForRow(dataRow) {
    var dataValue = 0;
    var i = 1;
    for (var answerName in dataRow) {
        var value = parseInt(dataRow[answerName]);
        dataValue = dataValue + (value * i);
        if (++i == 6) {
            break;
        }
    }
    return (dataValue / (i - 1));
}

function displayTable(data) {
    var raw_template = $('#tableTemplate').html();
    // Compile that into an handlebars template
    var template = Handlebars.compile(raw_template);
    // Retrieve the placeHolder where the Posts will be displayed
    var placeHolder = "test";
    // Create a context to render the template
    var context = {"data": getPercentages(data)};
    // Generate the HTML for the template
    var html = template(context);
    // Render the posts into the page
    $("body").append(html);
    $('table').dataTable();
}

function array_flip( trans )
{
    var key, tmp_ar = {};

    for ( key in trans )
    {
        if ( trans.hasOwnProperty( key ) )
        {
            tmp_ar[trans[key]] = key;
        }
    }

    return tmp_ar;
}
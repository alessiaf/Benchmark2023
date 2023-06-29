var configBubble, configTopV, configTopT;
var myChartBubble, myChartTopV, myChartTopT;
var ctxBubble, ctxTopV, ctxTopT;
var chartBubble, chartTopT, chartTopV;
var desc_num_list = [];
var desc_den_list = []; 
var list_uni_fis = ["0","1","2","3","4","5","6","7","8","9","10","11","17","21","22","23","24","25","26"];
var list_uni_tel = ["12","13","14","15","16","18","19","20"];
var sorgente_dati;
var lista_indicatori;
var uni_top_sel = [];
var uni_top_sel_trend = [];
var uni_top_sel_val = [];

$(document).ready(function() {
	
	sorgente_dati = JSON.parse(getSorgenteDati());
	lista_indicatori = JSON.parse(getLabelIndicatori());
	popolaComboIndicatori(lista_indicatori);
	popolaListaUniversita();
	$('#table-custom-id').addClass('hide').removeClass('show');
	$('#radio-top').addClass('hide').removeClass('show');
	$('#grafico-d').addClass('hide').removeClass('show');

	let checkboxes = $("input[type=checkbox][name=check-uni]");

	$('input[type=radio][name=top-value]').change(function() {
		costruisciGraficoTop();
		creaStrutturaGraficoTopValue();
		creaStrutturaGraficoTopTrend();
	});

	$("#desel-all-btn").click(function() {
		let checkboxes = $("input[type=checkbox][name=check-uni]");
		for (var i=0; i<checkboxes.length; i++) {
			checkboxes[i].checked = false;
		}
		gestioneMultiUni();
		gestioneSingolaUni();

		$('#desel-all-btn'). attr("disabled", true);

	});

	checkboxes.change(function() {
			  
		  if (this.value == 99) {
			selezionaDeselezionaTutteUni(this.checked);
		  } else if (this.value == 999) {
			selezionaDeselezionaTutteUniTelematiche(this.checked);
		  } else if (this.value == 50) {
			selezionaDeselezionaTutteUniFisiche(this.checked);
		  } else {
			selezionaDeselezionaSingolaUni(this.checked);
		  }

		  if (checkboxesSelezionateCount() > 0) {
			$('#desel-all-btn'). attr("disabled", false);
		  } else {
			$('#desel-all-btn'). attr("disabled", true);
		  }

		  gestioneSingolaUni();
		  gestioneMultiUni();

	  });
	
		
	$( "#ind-select" ).change(function() {

		if (checkboxesSelezionateCount() == 1) {
			configBubble = costruisciGraficoDispersione();
			myChartBubble = document.getElementById('grafico-dispersione');
			ctxBubble = myChartBubble.getContext('2d');

			if (chartBubble != null) {
				chartBubble.destroy();
			}

			chartBubble = new Chart(ctxBubble, configBubble);
		}

		if (checkboxesSelezionateCount() > 4) {
			costruisciGraficoTop();
			creaStrutturaGraficoTopValue();
			creaStrutturaGraficoTopTrend();
		}

	});

	
});

function gestioneSingolaUni() {
	if (checkboxesSelezionateCount() == 1 && this.value != 99 && this.value != 999 && this.value != 50) {
		configBubble = costruisciGraficoDispersione();
		myChartBubble = document.getElementById('grafico-dispersione');
		ctxBubble = myChartBubble.getContext('2d');

		if (chartBubble != null) {
			chartBubble.destroy();
		}

		chartBubble = new Chart(ctxBubble, configBubble);

		$('#grafico-d').addClass('show').removeClass('hide');
		$('#table-custom-id').addClass('show').removeClass('hide');
		costruisciTabellaIndicatori();
	  } else if (checkboxesSelezionateCount() == 0 || checkboxesSelezionateCount() > 1) {
		$('#grafico-d').addClass('hide').removeClass('show');
		$('#table-custom-id').addClass('hide').removeClass('show');
	  }	
}

function gestioneMultiUni() {
	if (checkboxesSelezionateCount() > 9) {
		$('#radio-top').addClass('show').removeClass('hide');
		$('#top-five-id')[0].checked = true;
	  } else {
		$('#radio-top').addClass('hide').removeClass('show');
	  }
	  
	  if (checkboxesSelezionateCount() > 4) {
		$('#grafico-top-valore').addClass('show').removeClass('hide');
		$('#grafico-top-trend').addClass('show').removeClass('hide');
		costruisciGraficoTop();
		creaStrutturaGraficoTopValue();
		creaStrutturaGraficoTopTrend();
	  } else {
		$('#grafico-top-valore').addClass('hide').removeClass('show');
		$('#grafico-top-trend').addClass('hide').removeClass('show');
	  }
}

function creaStrutturaGraficoTopValue() {
	let descUniSel = [];
	let topValueSel = [];
	let numero_top_value = (checkboxesSelezionateCount() < 10) ? 5 : $("#radio-top input[type='radio'][name='top-value']:checked").val();

	for(let k=0; k<uni_top_sel_val.length; k++) {
		descUniSel.push(uni_top_sel_val[k].uni);
		topValueSel.push(uni_top_sel_val[k].value);
	}
	
	var strutturaGraficoTopValue = {
		type : 'horizontalBar',
		data : {
			labels : descUniSel,
			datasets : [ {
				label : 'Valore',
				data : topValueSel,
				backgroundColor : 'rgb(81, 136, 52)',
				borderColor : 'rgb(65, 65, 65)',
				pointBackgroundColor: 'rgb(237, 125, 49)'
			}
			]
		},

		options : {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: true,
				fontSize: 18,
				fontColor: '#000',
				fontFamily: 'Arial', 
				position: 'top',
				text: 'Top ' + numero_top_value + ' per Valore'
			},
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Valore indicatore anno 2023"
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Universita\'"
					}
				}]
			},
			tooltips : {
				callbacks : {
					title : function(tooltipItem, data) {
						return uni_top_sel_val[tooltipItem[0]['index']].uni;
					},
					label : function(tooltipItem, data) {
						value = Number(uni_top_sel_val[tooltipItem['index']].value);
						descValue = 'Valore 2023: ' + value.toFixed(3);
						return [ descValue ];

					}
				},
				backgroundColor : '#FFF',
				titleFontSize : 16,
				titleFontColor : '#000',
				bodyFontColor : '#000',
				bodyFontSize : 14,
				displayColors : false,
				borderColor : 'rgba(0,0,0,1)',
				borderWidth : 1
			}
		}
	};

	configTopV = strutturaGraficoTopValue;
	myChartTopV = document.getElementById('grafico-top-valore-chart');
	ctxTopV = myChartTopV.getContext('2d');

	if (chartTopV != null) {
		chartTopV.destroy();
	}

	chartTopV = new Chart(ctxTopV, configTopV);
	chartTopV.canvas.parentNode.style.width = '700px';
	chartTopV.canvas.parentNode.style.height = '400px';
	chartTopV.update();
}

function creaStrutturaGraficoTopTrend() {
	let descUniSel = [];
	let topTrendSel = [];
	let numero_top_trend = (checkboxesSelezionateCount() < 10) ? 5 : $("#radio-top input[type='radio'][name='top-value']:checked").val();

	for(let k=0; k<uni_top_sel_trend.length; k++) {
		descUniSel.push(uni_top_sel_trend[k].uni);
		topTrendSel.push(uni_top_sel_trend[k].trend);
	}
	
	var strutturaGraficoTopTrend = {
		type : 'horizontalBar',
		data : {
			labels : descUniSel,
			datasets : [ {
				label : 'Variazione anno precedente',
				data : topTrendSel,
				backgroundColor : 'rgb(0, 131, 208)',
				borderColor : 'rgb(65, 65, 65)',
				pointBackgroundColor: 'rgb(237, 125, 49)'
			}
			]
		},

		options : {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: true,
				fontSize: 18,
				fontColor: '#000',
				fontFamily: 'Arial', 
				position: 'top',
				text: 'Top ' + numero_top_trend + ' per variazione anno precedente'
			},
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Variazione anno precedente"
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Universita\'"
					}
				}]
			},
			tooltips : {
				callbacks : {
					title : function(tooltipItem, data) {
						return uni_top_sel_trend[tooltipItem[0]['index']].uni;
					},
					label : function(tooltipItem, data) {
						value = Number(uni_top_sel_trend[tooltipItem['index']].trend);
						descValue = 'Variazione anno precedente: ' + value.toFixed(3);
						return [ descValue ];

					}
				},
				backgroundColor : '#FFF',
				titleFontSize : 16,
				titleFontColor : '#000',
				bodyFontColor : '#000',
				bodyFontSize : 14,
				displayColors : false,
				borderColor : 'rgba(0,0,0,1)',
				borderWidth : 1
			}
		}
	};

	configTopT = strutturaGraficoTopTrend;
	myChartTopT = document.getElementById('grafico-top-trend-chart');
	ctxTopT = myChartTopT.getContext('2d');

	if (chartTopT != null) {
		chartTopT.destroy();
	}

	chartTopT = new Chart(ctxTopT, configTopT);
	chartTopT.canvas.parentNode.style.width = '700px';
	chartTopT.canvas.parentNode.style.height = '400px';
	chartTopT.update();
}

function costruisciGraficoTop() {
	var elem_sel_ind = $('#ind-select').val();
	var numero_top = (checkboxesSelezionateCount() > 9) ? $("#radio-top input[type='radio'][name='top-value']:checked").val() : 5;
	
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	let descUni, value2023Sel, valueInit;
	uni_top_sel = [];
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].checked && checkboxes[i].value != "99" && checkboxes[i].value != "999" && checkboxes[i].value != "50") {
			descUni = sorgente_dati[checkboxes[i].value]['value'];

			value2023Sel = sorgente_dati[checkboxes[i].value]['indicatori'][elem_sel_ind]['valore-2023'];
			value2023Sel = (value2023Sel != "NR" && value2023Sel != "ND") ? value2023Sel : 0;
			
			valueInit = sorgente_dati[checkboxes[i].value]['indicatori'][elem_sel_ind]['valore-iniziale'];
			valueInit = (valueInit != "NR" && valueInit != "ND") ? valueInit : 0;

			trendSel = value2023Sel - valueInit; 
			uni_top_sel.push({'uni': descUni, 'value': value2023Sel, 'trend': trendSel});
		}
	}

	uni_top_sel.sort(compareValue);
	uni_top_sel_val = [];

	for (let k=0; k< uni_top_sel.length && k<numero_top; k++) {
		uni_top_sel_val.push(uni_top_sel[k]);
	}

	uni_top_sel_trend = [];
	uni_top_sel.sort(compareTrend);

	for (let k=0; k< uni_top_sel.length && k<numero_top; k++) {
		uni_top_sel_trend.push(uni_top_sel[k]);
	}
	
}

function compareValue(a, b) {
	if (Number(a.value) < Number(b.value)) {
		return 1;
	}
	if (Number(a.value) > Number(b.value)) {
		return -1;
	}
	return 0;
}

function compareTrend(a, b) {
	if (Number(a.trend) < Number(b.trend)) {
		return 1;
	}
	if (Number(a.trend) > Number(b.trend)) {
		return -1;
	}
	return 0;
}

function checkboxesSelezionateCount() {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	let checkSel = 0;
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			checkSel++;
		}
	}
	return checkSel;	
}

function checkboxesSelezionate() {
	let arrayCheckboxesSel = [];
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			arrayCheckboxesSel.push(checkboxes[i].value);
		}
	}
	return arrayCheckboxesSel;	
}

function costruisciGraficoDispersione() {

	var elem_sel_ind = $('#ind-select').val();

	var idUniSel = checkboxesSelezionate()[0];
	var uniSelValueDataset = [];
	var descUnivSel;
	var listaAltreUniDataset = [];
	var listaAltreUniDatasetID = [];

	var rapportoBolle;
	
	if (elem_sel_ind == 4) {
		rapportoBolle = 0.1;
	} else if (elem_sel_ind == 5) {
		rapportoBolle = 300;
	} else if (elem_sel_ind == 2){
		rapportoBolle = 50;
	} else {
		rapportoBolle = 20;
	}

	for (let i=0; i<sorgente_dati.length; i++) {

		var raggio = (sorgente_dati[i]['indicatori'][elem_sel_ind]['valore-2023'] != "NR" 
						&& sorgente_dati[i]['indicatori'][elem_sel_ind]['valore-2023'] != "ND") 
						? sorgente_dati[i]['indicatori'][elem_sel_ind]['valore-2023'] * rapportoBolle : 0;

		var bollaUni = {x:i+1, 
			y:0, 
			r:raggio
		};
		
		if (sorgente_dati[i]['id'] == idUniSel) {
			descUnivSel = sorgente_dati[i]['value'];
			uniSelValueDataset.push(bollaUni);

			if (bollaUni.r == 0) {
				// nascondi grafico a dispersione e allarga tabella se il valore per l'uni selezionata è zero
				$('#grafico-d-div').addClass('hide').removeClass('show');
				$('#table-custom-div').addClass('col-md-12').removeClass('col-md-6');
			} else {
				$('#grafico-d-div').addClass('show').removeClass('hide');
				$('#table-custom-div').addClass('col-md-6').removeClass('col-md-12');
			}

		} else {
			listaAltreUniDataset.push(bollaUni);
			listaAltreUniDatasetID.push(sorgente_dati[i]['id']);
		}
	}

	return {
		type : 'bubble',
		data : {
			datasets : [ {
				label : descUnivSel,
				backgroundColor : 'rgb(30,144,255)',
				borderColor : 'rgb(0,0,0)',
				hoverBackgroundColor: 'rgb(30,100,255)',
				data : uniSelValueDataset
			},
			{
				label : 'Altre universita\'',
				data : listaAltreUniDataset,
				backgroundColor : 'rgb(255,140,0)',
				hoverBackgroundColor: 'rgb(255,89,0)',
				borderColor : 'rgb(0,0,0)',
				pointBackgroundColor: 'rgb(255,140,0)'
			}
			]
		},
		options : {
			responsive: true,
			tooltips : {
				callbacks : {
					title : function(tooltipItem, data) {
						if (tooltipItem[0]['datasetIndex'] == 1)
							return sorgente_dati[listaAltreUniDatasetID[tooltipItem[0]['index']]]['value'];
						return descUnivSel;
					},
					label : function(tooltipItem, data) {
						if (tooltipItem['datasetIndex'] == 1) {
							var indiceAltreUni = listaAltreUniDatasetID[tooltipItem['index']];
							valuePrec = sorgente_dati[indiceAltreUni]['indicatori'][elem_sel_ind]['valore-iniziale'];
							valuePrec = isValueND(valuePrec) ? 0 : Number(valuePrec);
							value2023 = sorgente_dati[indiceAltreUni]['indicatori'][elem_sel_ind]['valore-2023'];
							value2023 = isValueND(value2023) ? 0 : Number(value2023);
							descPrec = 'Valore precedente: ';
							descPrec += (isValueND(sorgente_dati[indiceAltreUni]['indicatori'][elem_sel_ind]['valore-iniziale'])) ? "ND" : valuePrec.toFixed(3);
							desc2023 = 'Valore 2023: ';
							desc2023 += (isValueND(sorgente_dati[indiceAltreUni]['indicatori'][elem_sel_ind]['valore-2023'])) ? "ND" : value2023.toFixed(3);
							valueTrend = (isValueND(sorgente_dati[indiceAltreUni]['indicatori'][elem_sel_ind]['valore-iniziale']) 
										   || isValueND(sorgente_dati[indiceAltreUni]['indicatori'][elem_sel_ind]['valore-2023'])) ? "ND" : (value2023 - valuePrec).toFixed(3);
							trend = 'Variazione anno precedente: ' + valueTrend;
						} else {
							valuePrec = sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-iniziale'];
							valuePrec = isValueND(valuePrec) ? 0 : Number(valuePrec);
							value2023 = sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-2023'];
							value2023 = isValueND(value2023) ? 0 : Number(value2023);

							descPrec = 'Valore precedente: ';
							descPrec += (isValueND(sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-iniziale'])) ? "ND" : valuePrec.toFixed(3);
							desc2023 = 'Valore 2023: ';
							desc2023 += (isValueND(sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-2023'])) ? "ND" : value2023.toFixed(3);
							valueTrend = (isValueND(sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-iniziale']) 
										   || isValueND(sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-2023'])) ? "ND" : (value2023 - valuePrec).toFixed(3);
							trend = 'Variazione anno precedente: ' + valueTrend;
						}
						
						return [ descPrec, desc2023, trend ];

					}
				},
				backgroundColor : '#FFF',
				titleFontSize : 16,
				titleFontColor : '#000',
				bodyFontColor : '#000',
				bodyFontSize : 14,
				displayColors : false,
				borderColor : 'rgba(0,0,0,1)',
				borderWidth : 1
			},
			scales: {
				 yAxes: [ {
					ticks: {
						callback: function(value, index, values) {
							return " ";
						},
						scaleLabel: {
							display: true
						}
					}
				 } ],
				 xAxes : [ { 
					ticks: {
						callback: function(value, index, values) {
							return "";
						}
					}
				 } ]
			},
			legend: {
				display: true,
				labels: {
					useLineStyle: true,
					usePointStyle: true
				}
			}
		}
	}

}

function isValueND (value) {
	return (value == "NR" || value == "ND");
}

function costruisciTabellaIndicatori() {
	var uniSelezionata = checkboxesSelezionate()[0];
	var listaIndicatori = sorgente_dati[uniSelezionata]['indicatori'];
	$('#content-body').empty();

	for (var k=0; k<listaIndicatori.length; k++) {

		let descValPrec = (listaIndicatori[k]['valore-iniziale'] == 'ND' || listaIndicatori[k]['valore-iniziale'] == 'NR') ? listaIndicatori[k]['valore-iniziale'] : listaIndicatori[k]['valore-iniziale'];
		let descVal2023 = (listaIndicatori[k]['valore-2023'] == 'ND' || listaIndicatori[k]['valore-2023'] == 'NR') ? listaIndicatori[k]['valore-2023'] : listaIndicatori[k]['valore-2023'];
		let trend, trendValue;
		
		if (listaIndicatori[k]['valore-iniziale'] != 'ND' && listaIndicatori[k]['valore-iniziale'] != 'NR'
				&& listaIndicatori[k]['valore-2023'] != 'ND' && listaIndicatori[k]['valore-2023'] != 'NR') {
			trend = listaIndicatori[k]['valore-2023'] - listaIndicatori[k]['valore-iniziale'];
			trendValue = trend;
			trend = trend.toFixed(3);
		} else {
			trend = 'ND';
			trendValue = 0;
		}

		let denIndicatore = lista_indicatori[k]['value'].substr(0,3);

		$('#content-body').append('<tr>');
		$('#content-body').append('<td>'+ denIndicatore +'</td>');
		$('#content-body').append('<td>'+ descValPrec +'</td>');
		$('#content-body').append('<td>'+ descVal2023 + '</td>');
		$('#content-body').append('<td>'+ trend +'</td>');

		if (trendValue != 0) {
			if (trendValue > 0) {
				$('#content-body').append('<td><img style="width:20px; height:20px;" src="resources/freccia verde.png"></img></td>');
			} else {
				$('#content-body').append('<td><img style="width:20px; height:20px;" src="resources/freccia rossa.png"></img></td>');
			}
		} else {
			$('#content-body').append('<td></td>');
		}

		$('#content-body').append('</tr>');
	}

}

function selezionaDeselezionaTutteUni(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		checkboxes[i].checked = checked;
	}
}

function selezionaDeselezionaTutteUniTelematiche(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (list_uni_tel.includes(checkboxes[i].value)) {
			checkboxes[i].checked = checked;
		}
		if (checkboxes[i].value == "99") {
			checkboxes[i].checked = false;
		}
	}
}

function selezionaDeselezionaTutteUniFisiche(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (list_uni_fis.includes(checkboxes[i].value)) {
			checkboxes[i].checked = checked;
		}
		if (checkboxes[i].value == "99") {
			checkboxes[i].checked = false;
		}
	}
}

function selezionaDeselezionaSingolaUni(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].value == "99" || checkboxes[i].value == "999" || checkboxes[i].value == "50") {
			checkboxes[i].checked = false;
		}
	}
}

function popolaListaUniversita() {
	var x = document.getElementById("ind-uni");
	var checkbox;
	var label;
	var br;

	for (var i = 0; i < sorgente_dati.length; i++) {
		checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("value", sorgente_dati[i]['id']);
		checkbox.setAttribute("id", "uni" + sorgente_dati[i]['id']);
		checkbox.setAttribute("name", "check-uni");
		x.appendChild(checkbox);

		label = document.createElement("label");
		label.htmlFor = "uni" + sorgente_dati[i]['id'];
		label.innerHTML = sorgente_dati[i]['value'];
		x.appendChild(label);

		br = document.createElement("br");
		x.appendChild(br);
	}
		
}

function popolaComboIndicatori(lista_indicatori) {
	var x = document.getElementById("ind-select");
	var option;
	
	for (var i = 0; i < lista_indicatori.length; i++) {
		option = document.createElement("option");
		option.text = lista_indicatori[i]['value'];
		option.value = lista_indicatori[i]['id'];
		option.title = lista_indicatori[i]['value'];
		x.add(option);
	}
		
}

function getLabelIndicatori() {
	return `
	[
		{
			"id" : "0",
			"value": "A_A - Proporzione di studenti che si iscrivono al II anno della stessa classe di laurea o laurea magistrale a ciclo unico (L, LMCU) avendo acquisito almeno 40 CFU in rapporto alla coorte di immatricolati nell'a.a. precedente"
		},
		{
			"id" : "1",
			"value": "A_B - Proporzione dei docenti di ruolo indicati come docenti di riferimento che appartengono a settori scientifico-disciplinari (SSD) di base e caratterizzanti nei corsi di studio (L, LM, LMCU) attivati"
		},
		{
			"id" : "2",
			"value": "B_A - Rapporto fra gli iscritti al primo anno dei corsi di dottorato con borsa di studio rispetto al totale dei docenti di ruolo"
		},
		{
			"id" : "3",
			"value": "C_A - Proporzione dei laureandi complessivamente soddisfatti del Corso di Studio"
		},
		{
			"id" : "4",
			"value": "C_B - Rapporto studenti regolari/docenti di ruolo e riduzione di tale rapporto"
		},
		{
			"id" : "5",
			"value": "D_A (D_C Scuole Superiori) - Proporzione di CFU conseguiti all'estero dagli studenti, ivi inclusi quelli acquisiti durante periodi di 'mobilita\' virtuale'"
		},
		{
			"id" : "6",
			"value": "D_B - Proporzione di Dottori di ricerca che hanno trascorso almeno 3 mesi all'estero"
		},
		{
			"id" : "7",
			"value": "E_A - Proporzione dei Professori di I e II fascia assunti dall'esterno nel triennio precedente, sul totale dei professori reclutati"
		},
		{
			"id" : "8",
			"value": "E_B - Proporzione di ricercatori di cui all'art. 24, c. 3, lett. a) e lett. b) sul totale dei docenti di ruolo"
		}
	]
	`;
}

function getSorgenteDati() {
	return `
	[
		{
			"id" : "0",
			"value": "Campus Bio-Medico",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.511",
					"valore-2023": "0.731"
				},
				{
					"id": "1",
					"valore-iniziale": "0.889",
					"valore-2023": "0.895"
				},
				{
					"id": "2",
					"valore-iniziale": "0.469",
					"valore-2023": "0.356"
				},
				{
					"id": "3",
					"valore-iniziale": "0.924",
					"valore-2023": "0.926"
				},
				{
					"id": "4",
					"valore-iniziale": "13.819",
					"valore-2023": "14.4"
				},
				{
					"id": "5",
					"valore-iniziale": "0.001",
					"valore-2023": "0.03"
				},
				{
					"id": "6",
					"valore-iniziale": "0.04",
					"valore-2023": "0.15"
				},
				{
					"id": "7",
					"valore-iniziale": "0.174",
					"valore-2023": "0.132"
				},
				{
					"id": "8",
					"valore-iniziale": "0.275",
					"valore-2023": "0.339"
				}
			]
		},
		{
			"id" : "1",
			"value": "HUMANITAS University",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.624",
					"valore-2023": "0.664"
				},
				{
					"id": "1",
					"valore-iniziale": "0.977",
					"valore-2023": "1"
				},
				{
					"id": "2",
					"valore-iniziale": "0.173",
					"valore-2023": "0.269"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "13.009",
					"valore-2023": "13.854"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "7",
					"valore-iniziale": "0.424",
					"valore-2023": "0.361"
				},
				{
					"id": "8",
					"valore-iniziale": "0.436",
					"valore-2023": "0.485"
				}
			]
		},
		{
			"id" : "2",
			"value": "IULM - MILANO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.647",
					"valore-2023": "0.739"
				},
				{
					"id": "1",
					"valore-iniziale": "0.831",
					"valore-2023": "0.84"
				},
				{
					"id": "2",
					"valore-iniziale": "0.17",
					"valore-2023": "0.175"
				},
				{
					"id": "3",
					"valore-iniziale": "0.911",
					"valore-2023": "0.911"
				},
				{
					"id": "4",
					"valore-iniziale": "73",
					"valore-2023": "73.619"
				},
				{
					"id": "5",
					"valore-iniziale": "0.007",
					"valore-2023": "0.016"
				},
				{
					"id": "6",
					"valore-iniziale": "0.125",
					"valore-2023": "0.143"
				},
				{
					"id": "7",
					"valore-iniziale": "0.357",
					"valore-2023": "0.211"
				},
				{
					"id": "8",
					"valore-iniziale": "0.149",
					"valore-2023": "0.175"
				}
			]
		},
		{
			"id" : "3",
			"value": "LINK CAMPUS",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.539",
					"valore-2023": "0.405"
				},
				{
					"id": "1",
					"valore-iniziale": "0.875",
					"valore-2023": "0.911"
				},
				{
					"id": "2",
					"valore-iniziale": "0.125",
					"valore-2023": "0.088"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "9",
					"valore-2023": "9.105"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0.005"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.667",
					"valore-2023": "0.912"
				},
				{
					"id": "8",
					"valore-iniziale": "0.042",
					"valore-2023": "0.123"
				}
			]
		},
		{
			"id" : "4",
			"value": "LIUC",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.645",
					"valore-2023": "0.645"
				},
				{
					"id": "1",
					"valore-iniziale": "0.894",
					"valore-2023": "0.92"
				},
				{
					"id": "2",
					"valore-iniziale": "0.204",
					"valore-2023": "0.212"
				},
				{
					"id": "3",
					"valore-iniziale": "0.954",
					"valore-2023": "0.942"
				},
				{
					"id": "4",
					"valore-iniziale": "52.429",
					"valore-2023": "47.192"
				},
				{
					"id": "5",
					"valore-iniziale": "0.037",
					"valore-2023": "0.063"
				},
				{
					"id": "6",
					"valore-iniziale": "0.667",
					"valore-2023": "1"
				},
				{
					"id": "7",
					"valore-iniziale": "0.3",
					"valore-2023": "0.3"
				},
				{
					"id": "8",
					"valore-iniziale": "0.204",
					"valore-2023": "0.25"
				}
			]
		},
		{
			"id" : "5",
			"value": "Luiss Guido Carli",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.792",
					"valore-2023": "0.811"
				},
				{
					"id": "1",
					"valore-iniziale": "0.917",
					"valore-2023": "0.92"
				},
				{
					"id": "2",
					"valore-iniziale": "0.267",
					"valore-2023": "0.295"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "81.612",
					"valore-2023": "77.385"
				},
				{
					"id": "5",
					"valore-iniziale": "0.038",
					"valore-2023": "0.057"
				},
				{
					"id": "6",
					"valore-iniziale": "0.143",
					"valore-2023": "0.111"
				},
				{
					"id": "7",
					"valore-iniziale": "0.514",
					"valore-2023": "0.568"
				},
				{
					"id": "8",
					"valore-iniziale": "0.121",
					"valore-2023": "0.107"
				}
			]
		},
		{
			"id" : "6",
			"value": "LUM 'G Degennaro'",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.495",
					"valore-2023": "0.36"
				},
				{
					"id": "1",
					"valore-iniziale": "0.958",
					"valore-2023": "0.932"
				},
				{
					"id": "2",
					"valore-iniziale": "0.218",
					"valore-2023": "0.148"
				},
				{
					"id": "3",
					"valore-iniziale": "0.954",
					"valore-2023": "0.97"
				},
				{
					"id": "4",
					"valore-iniziale": "24.436",
					"valore-2023": "23.951"
				},
				{
					"id": "5",
					"valore-iniziale": "0.017",
					"valore-2023": "0.032"
				},
				{
					"id": "6",
					"valore-iniziale": "1",
					"valore-2023": "0.286"
				},
				{
					"id": "7",
					"valore-iniziale": "0.522",
					"valore-2023": "0.696"
				},
				{
					"id": "8",
					"valore-iniziale": "0.236",
					"valore-2023": "0.246"
				}
			]
		},
		{
			"id" : "7",
			"value": "LUMSA - ROMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.69",
					"valore-2023": "0.693"
				},
				{
					"id": "1",
					"valore-iniziale": "0.941",
					"valore-2023": "0.57"
				},
				{
					"id": "2",
					"valore-iniziale": "0.284",
					"valore-2023": "0.188"
				},
				{
					"id": "3",
					"valore-iniziale": "0.959",
					"valore-2023": "0.957"
				},
				{
					"id": "4",
					"valore-iniziale": "67.51",
					"valore-2023": "64.513"
				},
				{
					"id": "5",
					"valore-iniziale": "0.005",
					"valore-2023": "0.019"
				},
				{
					"id": "6",
					"valore-iniziale": "0.364",
					"valore-2023": "0.176"
				},
				{
					"id": "7",
					"valore-iniziale": "0.324",
					"valore-2023": "0.412"
				},
				{
					"id": "8",
					"valore-iniziale": "0.039",
					"valore-2023": "0.12"
				}
			]
		},
		{
			"id" : "8",
			"value": "S Raffaele - MI",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.787",
					"valore-2023": "0.773"
				},
				{
					"id": "1",
					"valore-iniziale": "0.953",
					"valore-2023": "0.957"
				},
				{
					"id": "2",
					"valore-iniziale": "0.21",
					"valore-2023": "0.227"
				},
				{
					"id": "3",
					"valore-iniziale": "0.942",
					"valore-2023": "0.923"
				},
				{
					"id": "4",
					"valore-iniziale": "19.095",
					"valore-2023": "19.945"
				},
				{
					"id": "5",
					"valore-iniziale": "0.009",
					"valore-2023": "0.011"
				},
				{
					"id": "6",
					"valore-iniziale": "0.184",
					"valore-2023": "0.07"
				},
				{
					"id": "7",
					"valore-iniziale": "0.585",
					"valore-2023": "0.545"
				},
				{
					"id": "8",
					"valore-iniziale": "0.24",
					"valore-2023": "0.268"
				}
			]
		},
		{
			"id" : "9",
			"value": "San Raffaele Roma",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.381",
					"valore-2023": "0.357"
				},
				{
					"id": "1",
					"valore-iniziale": "0.873",
					"valore-2023": "0.907"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "116.446",
					"valore-2023": "136.789"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.56",
					"valore-2023": "0.5"
				},
				{
					"id": "8",
					"valore-iniziale": "0.375",
					"valore-2023": "0.316"
				}
			]
		},
		{
			"id" : "10",
			"value": "SC GASTRONOMICHE",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.455",
					"valore-2023": "0.739"
				},
				{
					"id": "1",
					"valore-iniziale": "1",
					"valore-2023": "1"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0.471"
				},
				{
					"id": "3",
					"valore-iniziale": "0.878",
					"valore-2023": "0.825"
				},
				{
					"id": "4",
					"valore-iniziale": "20.176",
					"valore-2023": "17.059"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "8",
					"valore-iniziale": "0.235",
					"valore-2023": "0.294"
				}
			]
		},
		{
			"id" : "11",
			"value": "Suor Orsola - NAPOLI",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.69",
					"valore-2023": "0.609"
				},
				{
					"id": "1",
					"valore-iniziale": "0.753",
					"valore-2023": "0.806"
				},
				{
					"id": "2",
					"valore-iniziale": "0.119",
					"valore-2023": "0.075"
				},
				{
					"id": "3",
					"valore-iniziale": "0.964",
					"valore-2023": "0.958"
				},
				{
					"id": "4",
					"valore-iniziale": "89.405",
					"valore-2023": "77.452"
				},
				{
					"id": "5",
					"valore-iniziale": "0.002",
					"valore-2023": "0.01"
				},
				{
					"id": "6",
					"valore-iniziale": "0.182",
					"valore-2023": "0.214"
				},
				{
					"id": "7",
					"valore-iniziale": "0.033",
					"valore-2023": "0.063"
				},
				{
					"id": "8",
					"valore-iniziale": "0.06",
					"valore-2023": "0.108"
				}
			]
		},
		{
			"id" : "12",
			"value": "Telemat GFORTUNATO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.4",
					"valore-2023": "0.106"
				},
				{
					"id": "1",
					"valore-iniziale": "0.885",
					"valore-2023": "0.927"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "60",
					"valore-2023": "25.614"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0.001"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.727",
					"valore-2023": "0.692"
				},
				{
					"id": "8",
					"valore-iniziale": "0",
					"valore-2023": "0.318"
				}
			]
		},
		{
			"id" : "13",
			"value": "Telematica GMarconi",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.343",
					"valore-2023": "0"
				},
				{
					"id": "1",
					"valore-iniziale": "0.885",
					"valore-2023": "0.868"
				},
				{
					"id": "2",
					"valore-iniziale": "0.138",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "114.615",
					"valore-2023": "0"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "0"
				},
				{
					"id": "7",
					"valore-iniziale": "0.125",
					"valore-2023": "0.25"
				},
				{
					"id": "8",
					"valore-iniziale": "0.108",
					"valore-2023": "0.176"
				}
			]
		},
		{
			"id" : "14",
			"value": "Telematica IUL",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.421",
					"valore-2023": "0.536"
				},
				{
					"id": "1",
					"valore-iniziale": "1",
					"valore-2023": "1"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "311",
					"valore-2023": "136.375"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "NR",
					"valore-2023": "1"
				},
				{
					"id": "8",
					"valore-iniziale": "0.5",
					"valore-2023": "0.5"
				}
			]
		},
		{
			"id" : "15",
			"value": "Telematica UNITELMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.058",
					"valore-2023": "0.084"
				},
				{
					"id": "1",
					"valore-iniziale": "0.971",
					"valore-2023": "0.882"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "41.529",
					"valore-2023": "51.788"
				},
				{
					"id": "5",
					"valore-iniziale": "0.001",
					"valore-2023": "0.002"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "8",
					"valore-iniziale": "0.324",
					"valore-2023": "0.303"
				}
			]
		},
		{
			"id" : "16",
			"value": "Telematica 'E-CAMPUS' ",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.289",
					"valore-2023": "0.229"
				},
				{
					"id": "1",
					"valore-iniziale": "0.959",
					"valore-2023": "0.971"
				},
				{
					"id": "2",
					"valore-iniziale": "0.167",
					"valore-2023": "0.126"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "376.583",
					"valore-2023": "303.709"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.359",
					"valore-2023": "0.72"
				},
				{
					"id": "8",
					"valore-iniziale": "0.097",
					"valore-2023": "0.252"
				}
			]
		},
		{
			"id" : "17",
			"value": "UKE - Kore ENNA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.499",
					"valore-2023": "0.529"
				},
				{
					"id": "1",
					"valore-iniziale": "0.947",
					"valore-2023": "0.931"
				},
				{
					"id": "2",
					"valore-iniziale": "0.209",
					"valore-2023": "0.171"
				},
				{
					"id": "3",
					"valore-iniziale": "0.955",
					"valore-2023": "0.962"
				},
				{
					"id": "4",
					"valore-iniziale": "28.03",
					"valore-2023": "27.918"
				},
				{
					"id": "5",
					"valore-iniziale": "0.001",
					"valore-2023": "0.006"
				},
				{
					"id": "6",
					"valore-iniziale": "0.381",
					"valore-2023": "0.087"
				},
				{
					"id": "7",
					"valore-iniziale": "0.161",
					"valore-2023": "0.242"
				},
				{
					"id": "8",
					"valore-iniziale": "0.149",
					"valore-2023": "0.178"
				}
			]
		},
		{
			"id" : "18",
			"value": "UNICUSANO - Roma",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.003",
					"valore-2023": "0.361"
				},
				{
					"id": "1",
					"valore-iniziale": "0.859",
					"valore-2023": "0.883"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0.173"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "110.778",
					"valore-2023": "122.673"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0.001"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.281",
					"valore-2023": "0.429"
				},
				{
					"id": "8",
					"valore-iniziale": "0.333",
					"valore-2023": "0.3"
				}
			]
		},
		{
			"id" : "19",
			"value": "UNINETTUNO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.056",
					"valore-2023": "0.152"
				},
				{
					"id": "1",
					"valore-iniziale": "0.857",
					"valore-2023": "0.813"
				},
				{
					"id": "2",
					"valore-iniziale": "0.167",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "103.533",
					"valore-2023": "149.735"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0.001"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.462",
					"valore-2023": "0.625"
				},
				{
					"id": "8",
					"valore-iniziale": "0.1",
					"valore-2023": "0.176"
				}
			]
		},
		{
			"id" : "20",
			"value": "UNINT - ROMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.573",
					"valore-2023": "0"
				},
				{
					"id": "1",
					"valore-iniziale": "0.833",
					"valore-2023": "0.842"
				},
				{
					"id": "2",
					"valore-iniziale": "0.194",
					"valore-2023": "0.211"
				},
				{
					"id": "3",
					"valore-iniziale": "0.886",
					"valore-2023": "0.892"
				},
				{
					"id": "4",
					"valore-iniziale": "44.056",
					"valore-2023": "38.421"
				},
				{
					"id": "5",
					"valore-iniziale": "0.006",
					"valore-2023": "0.011"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.222",
					"valore-2023": "0.444"
				},
				{
					"id": "8",
					"valore-iniziale": "0.194",
					"valore-2023": "0.184"
				}
			]
		},
		{
			"id" : "21",
			"value": "Univ Bocconi MILANO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.779",
					"valore-2023": "0.757"
				},
				{
					"id": "1",
					"valore-iniziale": "0.955",
					"valore-2023": "0.948"
				},
				{
					"id": "2",
					"valore-iniziale": "0.137",
					"valore-2023": "0.133"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "39.707",
					"valore-2023": "38.044"
				},
				{
					"id": "5",
					"valore-iniziale": "0.033",
					"valore-2023": "0.078"
				},
				{
					"id": "6",
					"valore-iniziale": "0.37",
					"valore-2023": "0.273"
				},
				{
					"id": "7",
					"valore-iniziale": "0.212",
					"valore-2023": "0.303"
				},
				{
					"id": "8",
					"valore-iniziale": "0.284",
					"valore-2023": "0.286"
				}
			]
		},
		{
			"id" : "22",
			"value": "Univ BOLZANO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.723",
					"valore-2023": "0.698"
				},
				{
					"id": "1",
					"valore-iniziale": "0.929",
					"valore-2023": "0.909"
				},
				{
					"id": "2",
					"valore-iniziale": "0.282",
					"valore-2023": "0.273"
				},
				{
					"id": "3",
					"valore-iniziale": "0.863",
					"valore-2023": "0.845"
				},
				{
					"id": "4",
					"valore-iniziale": "11.404",
					"valore-2023": "10.369"
				},
				{
					"id": "5",
					"valore-iniziale": "0.02",
					"valore-2023": "0.033"
				},
				{
					"id": "6",
					"valore-iniziale": "0.449",
					"valore-2023": "0.288"
				},
				{
					"id": "7",
					"valore-iniziale": "0.328",
					"valore-2023": "0.308"
				},
				{
					"id": "8",
					"valore-iniziale": "0.45",
					"valore-2023": "0.415"
				}
			]
		},
		{
			"id" : "23",
			"value": "Univ Catt SCuore",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.65",
					"valore-2023": "0.624"
				},
				{
					"id": "1",
					"valore-iniziale": "0.934",
					"valore-2023": "0.924"
				},
				{
					"id": "2",
					"valore-iniziale": "0.61",
					"valore-2023": "0.135"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "29.361",
					"valore-2023": "28.977"
				},
				{
					"id": "5",
					"valore-iniziale": "0.005",
					"valore-2023": "0.013"
				},
				{
					"id": "6",
					"valore-iniziale": "0.162",
					"valore-2023": "0.135"
				},
				{
					"id": "7",
					"valore-iniziale": "0.109",
					"valore-2023": "0.125"
				},
				{
					"id": "8",
					"valore-iniziale": "0.207",
					"valore-2023": "0.224"
				}
			]
		},
		{
			"id" : "24",
			"value": "Univ EUROPEA - ROMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.643",
					"valore-2023": "0.551"
				},
				{
					"id": "1",
					"valore-iniziale": "0.865",
					"valore-2023": "0.83"
				},
				{
					"id": "2",
					"valore-iniziale": "0.113",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.962",
					"valore-2023": "0.961"
				},
				{
					"id": "4",
					"valore-iniziale": "35.962",
					"valore-2023": "32.148"
				},
				{
					"id": "5",
					"valore-iniziale": "0.006",
					"valore-2023": "0.014"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2023": "0.125"
				},
				{
					"id": "7",
					"valore-iniziale": "0.067",
					"valore-2023": "0.1"
				},
				{
					"id": "8",
					"valore-iniziale": "0.151",
					"valore-2023": "0.185"
				}
			]
		},
		{
			"id" : "25",
			"value": "UnivStranREGGIO C",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.533",
					"valore-2023": "0.448"
				},
				{
					"id": "1",
					"valore-iniziale": "0.737",
					"valore-2023": "0.6"
				},
				{
					"id": "2",
					"valore-iniziale": "0.111",
					"valore-2023": "0.625"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2023": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "17.167",
					"valore-2023": "313"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "0.8",
					"valore-2023": "0.5"
				},
				{
					"id": "7",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "8",
					"valore-iniziale": "0.389",
					"valore-2023": "0.5"
				}
			]
		},
		{
			"id" : "26",
			"value": "VALLE D'AOSTA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.653",
					"valore-2023": "0.72"
				},
				{
					"id": "1",
					"valore-iniziale": "0.905",
					"valore-2023": "0.909"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2023": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.95",
					"valore-2023": "0.945"
				},
				{
					"id": "4",
					"valore-iniziale": "16.917",
					"valore-2023": "15.7"
				},
				{
					"id": "5",
					"valore-iniziale": "0.103",
					"valore-2023": "0.119"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2023": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.308",
					"valore-2023": "0.1"
				},
				{
					"id": "8",
					"valore-iniziale": "0.042",
					"valore-2023": "0.08"
				}
			]
		}		
	]
`;
}

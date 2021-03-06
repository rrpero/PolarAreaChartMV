/*
Ruben Albuquerque
Donut/PieChart Chart using RGraph with options  to  customize

*/

requirejs.config({
//    context: requirejs.s.contexts.sense ? "sense" : null,
    paths: {

        "RGraph": "../extensions/PolarAreaChartMV/libraries/RGraph.common.core",
		"RGraph.common.dynamic": "../extensions/PolarAreaChartMV/libraries/RGraph.common.dynamic",
		"RGraph.common.tooltips": "../extensions/PolarAreaChartMV/libraries/RGraph.common.tooltips",
		"RGraph.rosemv": "../extensions/PolarAreaChartMV/libraries/RGraph.rosemv",
		"RGraph.radar": "../extensions/PolarAreaChartMV/libraries/RGraph.radar",
		"RGraph.funnel": "../extensions/PolarAreaChartMV/libraries/RGraph.funnel",
		"RGraph.waterfall": "../extensions/PolarAreaChartMV/libraries/RGraph.waterfall",
		"RGraph.common.key": "../extensions/PolarAreaChartMV/libraries/RGraph.common.key",
		"d3":'../extensions/PolarAreaChartMV/libraries/d3',
		"viz":'../extensions/PolarAreaChartMV/libraries/viz'
		,
		"cloud":'../extensions/PolarAreaChartMV/libraries/d3.layout.cloud'
    },
 /*   shim: {
        "RGraph": {
         //   deps: ["RGraph.rose"],
            exports: "RGraph"
        },
        "RGraph.common.dynamic": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.common.tooltips": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.rose": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        },
        "RGraph.common.key": {
           deps: ["RGraph"]
           //, exports: "RGraph"
        }
    },*/
    waitSeconds: 60
})



define( [
		'jquery'
		,'qlik'
        ,'./properties/properties'
		,'./properties/initialProperties'
		,'d3'
		,'viz'	
		,'cloud'
		,"text!./border.css"
		,"RGraph"
		,"RGraph.rosemv"
		,"RGraph.radar"
		,"RGraph.funnel"
		,"RGraph.waterfall",	
		,"RGraph.common.dynamic"
		,"RGraph.common.tooltips"
		,"RGraph.common.key"
		,'./libraries/rainbowvis'
		,'./biPartite'
		,'./wordCloudChart'


		
    ],
	
    function ( $, qlik, props, initProps,d3,viz,cloud,css) {
        'use strict';	
		window.d3=d3;
		//window.RGraph={isRGraph: true};
		//Inject Stylesheet into header of current document
		$( '<style>' ).html(css).appendTo( 'head' );
		
        return {
			//window.RGraph=RGraph;
			//Define the properties tab - these are defined in the properties.js file
             definition: props,
			
			//Define the data properties - how many rows and columns to load.
			 initialProperties: initProps,
			
			//Allow export to print object 
			support : { export: true,
						snapshot:true
			},
			
			//Not sure if there are any other options available here.
			 snapshot: {cantTakeSnapshot: true
			 },

			//paint function creates the visualisation. - this one makes a very basic table with no selections etc.
            paint: function ($element, layout) {
				
				
				
			 var lastrow = 0, me = this;
			 //loop through the rows we have and render
			 var rowCount=this.backendApi.getRowCount();
			 var qMatrix =[];
			 this.backendApi.eachDataRow( function ( rownum, row ) {
						lastrow = rownum;
						if(typeof row[1] !== 'undefined')
							qMatrix[rownum]=row;
						//do something with the row..	
						if((lastrow+1)==rowCount){
							//console.log("row "  + row);
							//console.log("last "  + lastrow);
							//console.log("Row Count " +rowCount);
							
							paintAll($element,layout,qMatrix,me);
							//console.log("New qMatrix " +qMatrix.length);
							
						}
						
			 });
			 //console.log("last "  + lastrow);
			 //console.log("Row Count " +this.backendApi.getRowCount());
			 if(this.backendApi.getRowCount() > lastrow +1){
					 //we havent got all the rows yet, so get some more, 1000 rows
					  var requestPage = [{
							qTop: lastrow + 1,
							qLeft: 0,
							qWidth: 3, //should be # of columns
							qHeight: Math.min( 100, this.backendApi.getRowCount() - lastrow )
						}];
					   this.backendApi.getData( requestPage ).then( function ( dataPages ) {
								//when we get the result trigger paint again
								me.paint( $element,layout );
					   } );
			 }
			 else{

				 
			 }
			 
			 function paintAll($element,layout,qMatrix,me)
			 {
				//props['items']['optionsSizeBorders']['items']['Options']['items']['axes']['show']=false;
				//console.log(props['items']['optionsSizeBorders']['items']['Options']['items']['axes']);
				setUndefined();
				// Get the Number of Dimensions and Measures on the hypercube
				var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
				//console.log(numberOfDimensions);
				var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
				//console.log(numberOfMeasures);				
				

			

				var app = qlik.currApp(this);
				
				if(layout.polar=="biPartite"){
					if(numberOfDimensions==2 && numberOfMeasures==1)
						biPartite(app,$element,layout,qMatrix,d3,viz);
					else{
						//To generate random numbers to allow multiple charts to present on one sheet:						
						$element.html(getHtml(messages[language].BIPARTITE_DIMENSIONMEASURE));
					}
						
				}
				else if(layout.polar=="wordCloudChart"){
					if(numberOfDimensions==1 && numberOfMeasures==1)
						wordCloudChart(app,$element,layout,qMatrix,d3,cloud);
					else{
						//To generate random numbers to allow multiple charts to present on one sheet:						
						$element.html(getHtml(messages[language].WORDCLOUDCHART_DIMENSIONMEASURE));
					}					
				}
				else 
				{
				
					var html="";
					
					// Get the Number of Dimensions and Measures on the hypercube
					var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
					//console.log(numberOfDimensions);
					var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
					//console.log(numberOfMeasures);
					
					// Get the Measure Name and the Dimension Name
					var measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
					//console.log(measureName);
					
					// Get the number of fields of a dimension
					//var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
					var numberOfDimValues = qMatrix.length;
					//console.log("qMatrix.length: " + numberOfDimValues);				
					
					//var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
					//console.log(dimensionName);

					

					
					//console.log(qMatrix);
					//console.log(layout);
					var numberOfItems = numberOfDimValues;
					
					//var numberOfItems = numberOfMeasures;
					if(numberOfMeasures>1)
							numberOfItems=numberOfMeasures;

					
					
					
					// Get the values of the dimension
					var dimMeasArray=[];
					var dimArray =[];
					var measArrayNum =[];
					var measArrayText =[];
					var total= 0;

					var newStructure ={};
					if(numberOfDimensions>0 && numberOfMeasures <= 1)
					{
						for (var i=0; i<numberOfDimValues;i++){
							newStructure[qMatrix[i][0].qText]={};
							//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
						}
					
						var newStructureDim2 ={};
						for (var i=0; i<numberOfDimValues;i++){
							newStructureDim2[qMatrix[i][1].qText]=qMatrix[i][1].qNum;
							//console.log(Object.keys(newStructureDim2));
							//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
						}
					}
					else{
					
						var newStructureDim2 ={};
						for (var i=0; i<numberOfDimValues;i++){
							newStructureDim2[qMatrix[i][0].qText]={};

						}
						//console.log(layout.qHyperCube.qMeasureInfo);
						
						for (var i=0; i<numberOfMeasures;i++){
							newStructure[layout.qHyperCube.qMeasureInfo[i].qFallbackTitle]=layout.qHyperCube.qMeasureInfo[i].qMax;
						}
					}
					
					
					var palette = createPalette(numberOfItems,newStructure,newStructureDim2);
					
				
					
					/** TODO Pedir decimal e milhar do QS **/
					var  measArrayNum2 = [];
					var paletteKeep = [];
					var valueBelow = "--";
					if(layout.valueBelow)
						valueBelow = "\\n";


					if(numberOfDimensions==2 && numberOfMeasures <= 1){				
						for(var  i  in newStructure){
							//console.log(i);
							for(var  j  in newStructureDim2){
								newStructure[i][j]=0;
							}
						}				


						for (var i=0; i<numberOfDimValues;i++){
							newStructure[qMatrix[i][0].qText][qMatrix[i][1].qText]=qMatrix[i][2].qNum;
							//console.log(qMatrix[i][0].qText);
							//console.log(qMatrix[i][1].qText);
							//[qMatrix[i][1].qText]=qMatrix[i][2].qNum;
						}

						var  toolTipsArray = [];
						var ix=0;
						var itpx=0
						for(var  i  in newStructure){
							//console.log(i);
							var arrayValuesDim2=[]
							var tpuniq = [];
							var jx=0;
							for(var  j  in newStructureDim2){
								total = total + parseFloat(newStructure[i][j]);
								arrayValuesDim2[jx]=newStructure[i][j];
								//tpuniq[jx]= i+" - " + j + " - " + newStructure[i][j];
								
								jx++;
								toolTipsArray[itpx]=i+" - " + j + " - " + newStructure[i][j];
								itpx++;
							}
							measArrayNum2[ix]=arrayValuesDim2;
							//toolTipsArray[ix]=tpuniq;
							ix++;
						}

						
					}
					else if(numberOfDimensions==1 && numberOfMeasures <= 1){
						
						for(var  i  in newStructure){
							newStructure[i]=0;
						}	
						for (var i=0; i<numberOfDimValues;i++){
							newStructure[qMatrix[i][0].qText]=qMatrix[i][1].qNum;

						}
						
						var  toolTipsArray = [];
						var ix=0;
						var itpx=0
						for(var  i  in newStructure){
							total = total + parseFloat(newStructure[i]);
							
							//console.log(i);
							var arrayValuesDim2//=[];

							//arrayValuesDim2[ix]
							=  newStructure[i];

							toolTipsArray[itpx]=i+" - " + newStructure[i];
							itpx++;
							
							measArrayNum2[ix]=arrayValuesDim2;
							ix++;
						}					
						
						
					}
					else
					{
						
						var maxValue=0;
						/*
						for(var  i  in newStructure){
							newStructure[i]=0;
						}	
						for (var i=0; i<numberOfDimValues;i++){
							newStructure[qMatrix[i][0].qText]=qMatrix[i][1].qNum;

						}
						*/
						var  toolTipsArray = [];
						var ix=0;
						var itpx=0
						for(var  i  in newStructure){
							total = total + parseFloat(newStructure[i]);
							//console.log(i);
							var arrayValuesDim2//=[];

							//arrayValuesDim2[ix]
							=  newStructure[i];

							toolTipsArray[itpx]=i+" - " + newStructure[i];
							itpx++;
							
							measArrayNum2[ix]=arrayValuesDim2;
							if(arrayValuesDim2>maxValue)
								maxValue=arrayValuesDim2;
							ix++;
						}					
						
						
					}	
					
					


					//console.log(toolTipsArray);				
					

					//console.log("new");
					//console.log(newStructure);

					//console.log("num dim values " + numberOfDimValues);
					for (var i=0; i<numberOfDimValues;i++){

						//paletteKeep[i]=palette[layout.qHyperCube.qDataPages[0].qMatrix[i][0].qElemNumber];
						paletteKeep[i]=palette[qMatrix[i][0].qElemNumber];
						//dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
						dimArray[i] = qMatrix[i][0].qText;
						//console.log(qMatrix[i][1].qText+qMatrix[i][0].qText)
						//if(dimArray[i]=="Thresh")
						//console.log("Thresh  tem elem  number "  + qMatrix[i][0].qElemNumber);
						//measArrayNum[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qNum;
						measArrayNum[i] = qMatrix[i][1].qNum;
						
						//measArrayNum2[]
						
						//measArrayNum2[i]=[qMatrix[i][1].qNum,qMatrix[i][1].qNum/2];
						
						
						//console.log(qMatrix[i][0]);
						//console.log(qMatrix[i]);
						//measArrayText[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qText;
						measArrayText[i] = qMatrix[i][1].qText;
						//dimMeasArray[i] = dimArray[i] + valueBelow +measArrayText[i];
						dimMeasArray[i] = dimArray[i] + valueBelow +measArrayText[i];
						
						//total=total+parseFloat(measArrayNum[i]);	
						//console.log(dimArray[i]+"-"+measArrayNum[i]);
						
					}
					
					
					
					//% to Only Values
					var measArrayPerc = [];
					//var measArrayValue = [];
					
					var dimMeasPercArray=[];
					var dimMeasPercTPArray=[];			
					
					var origin=-Math.PI/2;
					var originAcc = 0;
					/*for (var i=0; i<numberOfDimValues;i++){
						
						
						var measPercArray = (parseFloat(measArrayNum[i])/total)*100;
											
						measPercArray= parseFloat(measPercArray).toFixed(1);					
						measArrayPerc[i]=measPercArray + "%";
											
						dimMeasPercArray[i] = dimArray[i] +valueBelow +measPercArray + "%";
						dimMeasPercTPArray[i] = dimensionName+'</br>' +
												'<div style="color:' + palette[i]+';">' + dimArray[i]+": " +measArrayText[i]+"</div>" +
												"Percentual: " + measPercArray + "%";
									
					}*/

					var dimensionLength=qMatrix.length;
									
					//To generate random numbers to allow multiple charts to present on one sheet:
					function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();};
					function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
					var tmpCVSID = guid();
						

					function capitalize(str) {
					
						if(layout.capitalize=="capitalize"){
							return str
								.toLowerCase()
								.split(' ')
								.map(function(word) {
									//console.log("First capital letter: "+word[0]);
									//console.log("remain letters: "+ word.substr(1));
									return word[0].toUpperCase() + word.substr(1);
								})
								.join(' ');
						}
						return str.toUpperCase();
					}

						
					var hashCode = function(str){
						var hash = 0;
						if (str.length == 0) return hash;
						for (i = 0; i < str.length; i++) {
							var char = str.charCodeAt(i);
							hash = ((hash<<5)-hash)+char;
							hash = hash & hash; // Convert to 32bit integer
						}
						//console.log(Math.abs(hash));
						return Math.abs(hash);
					}

					var html = '';			
					var width = $element.width(), height = $element.height();
					// add canvas for chart			
					html+='<div style="background-color: '+ layout.backgroundColor.color +';" id="canvas-wrapper-'+tmpCVSID+'"><canvas id="' + tmpCVSID + '" width="'+width+'" height="'+height+'">[No canvas support]</canvas></div><div id="myKey-'+tmpCVSID+'"></div>';
	//onsole.log(html);


					$element.html(html);
					
					
					var testRadius = width;
					if(width>height)
						testRadius=height;
					testRadius=testRadius*(layout.chartRadius/275);
					
					//console.log(parseInt(testRadius*0.04));
					//console.log((layout.labelTextSize/100));
					
					var labelTextSize = parseInt(testRadius*0.06)*(layout.labelTextSize/50);
					//console.log(labelTextSize);
					if(labelTextSize< 7)
						labelTextSize=7;				
					
					
					//RGraph.Reset(document.getElementById(tmpCVSID));
					var min = Math.min.apply(null, measArrayNum),
					max = Math.max.apply(null, measArrayNum);
					
					var diffMaxMin = max - min;
					

					
					var  maxTextSize = 20-layout.maxTextSize;
					if(width>height){
						tamanho=height;
						var  tamanho2=height/maxTextSize;
						//if((width/1.5)>height)
						//	var tamanho=height/2;
						
					}
					else{
						var tamanho=width;
						var  tamanho2=width/maxTextSize;
						//if((height/1.5)>=width)
						//	var tamanho=width/2;
					}
					
					if(measArrayNum.length>50)
						tamanho2=tamanho2-(tamanho2/5);
					
					tamanho=tamanho * (Math.log(measArrayNum.length)); 
					//console.log("LOG: " + Math.log(1000000*measArrayNum.length));
					//tamanho = height+width;				
					var fontMax =  5 + ((max/total)*tamanho);

						
					/*
					//console.log(dimArray.map(function(d,i) {
						  return {text: d, size: 10+measArrayNum[i], test: "haha"};
						}));*/
					var padding=3;
					if(layout.border)
						padding=padding+1;
					var font="QlikView Sans";
					//console.log(measArrayNum2);
					//console.log(Object.keys(newStructure));
					
					var keys = (numberOfDimensions==2&&numberOfMeasures<2)?Object.keys(newStructureDim2):Object.keys(newStructure);
					if (layout.chartLabels) {
						var labelsArray = Object.keys(newStructure);
						//var labelDimMeasArray =dimArray;
						
						/*if(layout.showValues=="value"||layout.showValues=="percent"){
							var labelsArray = Object.keys(newStructure);
							if(layout.onlyValues)
								labelsArray=measArrayText;		
							if(layout.showValues=="percent"){
								var labelsArray = dimMeasPercArray;
								if(layout.onlyValues)
									labelsArray=measArrayPerc;						
								//var labelDimMeasArray = dimMeasPercTPArray;
							}				
							}*/	
					

					} else {
						var labelsArray = null;
						//var labelDimMeasArray =[];
					}
					
					var labelAxes=layout.upScale+layout.downScale+layout.leftScale+layout.rightScale;
					if(labelAxes=="")
						labelAxes="";
					
					
					
					if(typeof(layout.grid)=="boolean")
						layout.grid=5;
					if(layout.grid<0)
						layout.grid=0;
					//console.log(layout.grid+0);
					
					
					//console.log(measArrayNum2);
					//console.log(testRadius);

					if(layout.polar=="waterfall"){
						
						if((layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1) ||
						layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0){
							labelsArray.push("Total");
							toolTipsArray.push("Total - " + total);
							var rose = new RGraph.Waterfall({
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									labels: labelsArray,
									textAccessible: true,
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize	,
									colors: palette	,
									gutterTop: 10,
									gutterLeft: layout.gutterLeft+(0.5*testRadius),
									gutterBottom: layout.gutterTop+(0.5*testRadius),
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
									},
									tooltipsEvent: 'onmousemove'
								}
							}).draw();
						}
						else
						{
							$element.html(getHtml(messages[language].WATERFALL_DIMENSIONMEASURE));
						}
						
					}
					else if(layout.polar=="funnel"){
						
						if((layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1) ||
						layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0){
							// Create the Funnel chart. Note the the values start at the maximum and decrease to the minimum.
							//console.log(palette);
							var rose = new RGraph.Funnel({
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									textBoxed: false,
									//title: 'Leads through to sales',
									labels: labelsArray,
									showvalues:layout.showvalues,
									shadow: true,
									labelsSticks:true,
									width:(width/2)/testRadius,
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize,
									funnelHorizontal:layout.gutterLeft,
									colors: palette,
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
									},
									tooltipsEvent: 'onmousemove'//,
									//gutterLeft: layout.showLegends ? layout.gutterLeft+190: layout.gutterLeft
								}
							}).draw();
						}
						else
						{
							$element.html(getHtml(messages[language].FUNNEL_DIMENSIONMEASURE));
						}
					}
					else if(layout.polar=="radar"){
						
						if((layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1) ||
							layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0){
							var name="";
							while(measArrayNum2.length<3)
							{
								name=name+" ";
								measArrayNum2.push(0);
								keys.push(name);
							}
							var rose =  new RGraph.Radar({
								width:100,
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									labels: keys,
									labelsBold:true,
									textAccessible: true,
									gutterLeft: layout.showLegends ? layout.gutterLeft+190: layout.gutterLeft,
									gutterRight: 100,
									gutterTop: layout.gutterTop,
									gutterBottom: 50,
									backgroundCircles: true,
									backgroundCirclesColor:'#000',
									backgroundCirclesCount:layout.grid,
									backgroundCirclesPoly:true,							
									//strokestyle: ['black'],
									linewidth:2,
									
									backgroundAxes:layout.axes,
									radius:testRadius,	
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize,
									colors:palette,
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
									},
									tooltipsEvent: 'onmousemove'
								}
							}).draw();
						}
						else
						{
							$element.html(getHtml(messages[language].RADAR_DIMENSIONMEASURE));
						}
					}
					else
					{
						if((layout.qHyperCube.qDimensionInfo.length==1 && layout.qHyperCube.qMeasureInfo.length==1) ||
							layout.qHyperCube.qMeasureInfo.length>1 && layout.qHyperCube.qDimensionInfo.length==0){
							//rainbow.setNumberRange(0, keys.length+1);
							//palette=getPalette(rainbow);
							//console.log(palette);
							var rose = new RGraph.RoseMV({
								//id: 'canvas-wrapper-'+tmpCVSID,
								id: tmpCVSID,
								data: measArrayNum2,
								options: {
									//variant: 'non-equi-angular',
									gutterLeft: layout.showLegends ? layout.gutterLeft+190: layout.gutterLeft,
									gutterRight: 100,
									gutterTop: layout.gutterTop,
									gutterBottom: 50,
									backgroundGridRadials:layout.gridRadials,
									//backgroundGridCount:layout.grid?layout.grid:0,
									backgroundGridCount:layout.grid,
									backgroundGrid:true,
									
									backgroundAxes:layout.axes,
									radius:testRadius,
									labelsAxes:layout.upScale+layout.downScale+layout.leftScale+layout.rightScale,
									labelsCount:layout.stepScale,
									ymax:maxValue,
									//labelsPosition:'edge',
									textFont:'QlikView Sans',
									labelsBoxed:false,
									textSize: labelTextSize,
									textSizeScale:Math.floor(labelTextSize*0.7),
									backgroundGridColor: 'rgba(155,155,155,1)',//'#989080',
									//tooltips: toolTipsArray,
									tooltips:function (idx)
									{
										return '<div id="__tooltip_div__">'+toolTipsArray[idx]+'</div>';
											   //'s stats<br/><canvas id="__tooltip_canvas__" width="400" height="150">='
											   //'[No canvas support]</canvas>';
										},
									tooltipsEvent: 'onmousemove',
									colorsSequential: (numberOfDimensions==2 && numberOfMeasures<2)?false:true,
									//colorsSequential: true,
									colors: palette,
									linewidth: 0,
									labels: labelsArray,
									showvalues:layout.showvalues,
									labelsApprox:layout.labelsApprox,
									//exploded: 3,
									//strokestyle:'rgba(0,0,0,0.8)',
									backgroundGridLinewidth:1,
									key:layout.showLegends ? keys: null,
									keyHalign:"right",
									keyPositionX:layout.keyPositionX,
									keyPositionY:layout.keyPositionY,
									keyPositionGraphBoxed:false,
									keyPosition:layout.graphGutter,
									keyTextBold:true,
									keyTextSize:labelTextSize-2,						
									eventsClick: onClickDimension
								}
							}).draw();
						}
						else
						{
							$element.html(getHtml(messages[language].POLAR_DIMENSIONMEASURE));
						}
					}
					rose.on('tooltip', function (obj)
					{
						//console.log(obj);
						
						//var tooltip = obj.get('tooltips');
						//var colors  = rose.properties.colors;
						
						//$("#__tooltip_div__").css('border','4px solid ' + colors[obj.__index__]);
						//tooltip.style.border = '4px solid ' + colors[obj.__index__]
					});
					
					RGraph.tooltips.style.backgroundColor = 'white';
					RGraph.tooltips.style.color           = 'black';
					RGraph.tooltips.style.fontWeight      = 'bold';
					RGraph.tooltips.style.boxShadow       = 'none';
					
					
					
					rose.canvas.onmouseout = function (e)
					{
						// Hide the tooltip
						RGraph.hideTooltip();
						
						// Redraw the canvas so that any highlighting is gone
						RGraph.redraw();
					}
					//needed for export
					
					function onClickDimension (e, shape)
					{
						var index = shape.index;
						//alert(dimensionName);
						//console.log(index);
						var ix=0;
						for(var  i in newStructure){
							for(var  j in newStructure[i]){
								if(ix==index)
									app.field(dimensionName).toggleSelect(i, true);
								ix++;
							}
							//console.log(i);
						}
						//if(index==1)
						
						//app.field(dimensionName).toggleSelect(dimArray[index], true);
						return  true;
					}	
				}					
				return qlik.Promise.resolve();	
			 }
			 
			 
			function getHtml(chartTypeMessage){
				function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();};
				function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
				var tmpCVSID = guid();						
				var html = '';			
				//var width = $element.width(), height = $element.height();
				// add canvas for chart			
				html+='<div style="background-color: #AAAAAA;" id="canvas-wrapper-'+tmpCVSID+'">'
							+chartTypeMessage+
					  '</div>';
				return html;
			}
			 
			function createPalette(numberOfItems,newStructure,newStructureDim2){
					
					var rainbow = new Rainbow(); 
					
					var palette =["RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)","RGB(141,170,203)","RGB(252,115,98)","RGB(187,216,84)","RGB(255,217,47)","RGB(102,194,150)","RGB(229,182,148)","RGB(231,138,210)","RGB(179,179,179)","RGB(166,216,227)","RGB(171,233,188)","RGB(27,125,156)","RGB(255,191,201)","RGB(77,167,65)","RGB(196,178,214)","RGB(178,36,36)","RGB(0,172,172)","RGB(190,108,44)","RGB(105,84,150)","RGB(80,160,240)","RGB(240,160,80)"];	
					
					

					//rainbow.setNumberRange(0, Object.keys(newStructureDim2).length+1);
					rainbow.setNumberRange(0, numberOfItems+1);
					
					
					function hexToRgb(hex) {
						// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
						var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
						hex = hex.replace(shorthandRegex, function(m, r, g, b) {
							return r + r + g + g + b + b;
						});

						var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
						return result ? {
							r: parseInt(result[1], 16),
							g: parseInt(result[2], 16),
							b: parseInt(result[3], 16)
						} : null;
					}				
					
					var borderBlack=[];
					function  getPalette(rainbowP){
						var s = [];
						for (var i = 0; i <= numberOfItems; i++) {
							var hexColour = rainbowP.colourAt(i);
							s[i]= '#' + hexColour;
							//console.log(numberOfItems + "-" +hexColour);
							var rgb=hexToRgb(s[i]);
							s[i]= 'RGBA('+rgb.r+ ',' + rgb.g + ',' + rgb.b+ ','+layout.transparent+')';
							borderBlack[i]="#000000";
						}
						return  s;
					}
					

					if(layout.palette=="analogue1"){
						rainbow.setSpectrum('#A500DB', '#006EE5', '#00CE36', '#E5D300', '#DB5800');
						palette=getPalette(rainbow);
					}
					if(layout.palette=="analogue2"){
						rainbow.setSpectrum('#3BDB00', '#E5A900', '#CE1A00', '#7500E5', '#00A2DB');
						palette=getPalette(rainbow);
					}
					if(layout.palette=="yellowRed"){
						rainbow.setSpectrum('#C7DB00','E5B800','CE7800','E53D00', '#DB0029');
						palette=getPalette(rainbow);
					}
					if(layout.palette=="whiteBlue"){
						rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
						palette=getPalette(rainbow);
					}
					if(layout.palette=="brazil"){
						rainbow.setSpectrum('#0025FF','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#FFFB00','#00D108');					
						palette=getPalette(rainbow);
					}				
					if(layout.palette=="colored"){
						//rainbow.setSpectrum('#D7FFF0','#90E8E8','#34B9FF','#0047E8','#0B00FF');					
						palette=getPalette(rainbow);
					}
					//palette=paletteBG;
					if(layout.palette=="default")
						palette=palette;
					
					
					return palette;
				}
			 
			 
			 function setUndefined(){
				 if(typeof(layout.showvalues) == "undefined")
					layout.showvalues=false;					 
				 if(typeof(layout.transparent) == "undefined")
					layout.transparent=1;					 
				 if(typeof(layout.labelsApprox) == "undefined")
					layout.labelsApprox=1;					 
				 if(typeof(layout.minTextSize) == "undefined")
					layout.minTextSize=15;	
				if(typeof(layout.maxTextSize) == "undefined")
					layout.maxTextSize=16;	
				if(typeof(layout.palette) == "undefined")
					layout.palette="analogue1";	
				if(typeof(layout.border) == "undefined")
					layout.border=false;
				if(typeof(layout.polar) == "undefined")
					layout.polar="polar";
				if(typeof(layout.backgroundColor) == "undefined"){
					layout.backgroundColor={};				
					layout.backgroundColor['color']="white;"
					layout.backgroundColor['color']="rgba(255,255,255,0);"
				}
				if(typeof(layout.bold) == "undefined")
					layout.bold="bold";				
				if(typeof(layout.capitalize) == "undefined")
					layout.capitalize="upper";	
					
				if(typeof(layout.keyPositionX) == "undefined")
					layout.keyPositionX=0;	
				if(typeof(layout.keyPositionY) == "undefined")
					layout.keyPositionY=0;	
				if(typeof(layout.graphGutter) == "undefined")
					layout.graphGutter="graph";		
				if(typeof(layout.labelTextSize) == "undefined")
					layout.labelTextSize=100;					
	
				if(typeof(layout.labelDistance) == "undefined")
					layout.labelDistance=10;
				
				if(typeof(layout.gutterTop) == "undefined")
					layout.gutterTop=30;			
				if(typeof(layout.gutterLeft) == "undefined")
					layout.gutterLeft=100;	

				if(typeof(layout.upScale) == "undefined")
					layout.upScale="n";	
				if(typeof(layout.downScale) == "undefined")
					layout.downScale="s";	
				if(typeof(layout.leftScale) == "undefined")
					layout.leftScale="w";	
				if(typeof(layout.rightScale) == "undefined")
					layout.rightScale="e";	
				if(typeof(layout.stepScale) == "undefined")
					layout.stepScale=5;	
				
				/*
				*/
				if(typeof(layout.fontColor) == "undefined"){
					layout.fontColor={};				
					//layout.fontColor['color']="white;"
					layout.fontColor['color']="#190000;"
				}
				/*
				//inicio bipartite
				if(typeof(layout.pad) == "undefined"){
						layout.pad=3;
				}
				if(typeof(layout.spaceLabelLeft) == "undefined"){
						layout.spaceLabelLeft=2;
				}
				if(typeof(layout.spaceLabelRight) == "undefined"){
						layout.spaceLabelRight=2;
				}
				if(typeof(layout.posX) == "undefined"){
						layout.posX=0;
				}
				if(typeof(layout.posY) == "undefined"){
						layout.posY=0;
				}				
				if(typeof(layout.width) == "undefined"){
						layout.width=8;
				}
				if(typeof(layout.height) == "undefined"){
						layout.height=8;
				}				
				if(typeof(layout.labelIn) == "undefined"){
						layout.labelIn="out";
				}				
				if(typeof(layout.barSize) == "undefined"){
						layout.barSize=0;
				}				
				if(typeof(layout.fontColor) == "undefined"){
					layout.fontColor={};				
					//layout.fontColor['color']="white;"
					layout.fontColor['color']="#190000;"
				}
				if(typeof(layout.fontSizeLabel) == "undefined")
					layout.fontSizeLabel=12;				
				if(typeof(layout.minTextSize) == "undefined")
					layout.minTextSize=15;	
				if(typeof(layout.maxTextSize) == "undefined")
					layout.maxTextSize=16;	
				if(typeof(layout.palette) == "undefined")
					layout.palette="analogue1";	
				if(typeof(layout.border) == "undefined")
					layout.border=false;
				if(typeof(layout.backgroundColor) == "undefined"){
					layout.backgroundColor={};				
					layout.backgroundColor['color']="white;"
					layout.backgroundColor['color']="rgba(255,255,255,0);"
				}
				if(typeof(layout.bold) == "undefined")
					layout.bold="bold";				
				if(typeof(layout.capitalize) == "undefined")
					layout.capitalize="upper";	
				if(typeof(layout.labelTextSize) == "undefined")
					layout.labelTextSize=100;	
	
				if(typeof(layout.labelDistance) == "undefined")
					layout.labelDistance=10;
				//fim bipartite
				*/
				 
			 }
		}	
		
		
		
	};

} );


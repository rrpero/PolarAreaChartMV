define( [

	'jquery',
	'qlik',
	'ng!$q',
	'ng!$http'


], function ($, qlik, $q, $http) {
    'use strict';
	//Define the current application
	var messages = {
		en_US: {
					
		},
		pt_BR: {
				
		}
	};
	var language="pt_BR";
	//var language="en_US";
	var app = qlik.currApp();

    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 0,
        max: 0
    };

    var measures = {
        uses: "measures",
        min: 1,
        max: 20
    };

    // *****************************************************************************
    // Appearance Section
    // *****************************************************************************
    var appearanceSection = {
        uses: "settings"
    };
	
	// *****************************************************************************
    // Sorting Section
    // *****************************************************************************
    var sortingSection = {
        uses: "sorting"
    };
	
	// *****************************************************************************
    // Options Section
    // *****************************************************************************
	
	messages[language].ROTATE_TYPE= "Tipo Rotação";
	messages[language].RANDOM2 = "Aleatório 2";
	messages[language].RANDOM7 = "Aleatório 7";
	messages[language].FIXED1 = "Fixo 1";	
	messages[language].FIXED2 = "Fixo 2";
	messages[language].FIXED3 = "Fixo 3";
	messages[language].FIXED4 = "Fixo 4";
	messages[language].FIXED5 = "Fixo 5";
	messages[language].FIXED7 = "Fixo 7";

	var rotateType = {
			type: "string",
			component: "dropdown",
			label: messages[language].ROTATE_TYPE,
			
			//label:app.GetLocaleInfo().qReturn.qCollation,
			ref: "rotateType",
			options: [{
				value: "random2",
				label: messages[language].RANDOM2
			}, 
			{
				value: "random7",
				label: messages[language].RANDOM7
			},
			{
				value: "fixed1",
				label: messages[language].FIXED1
			},
			{
				value: "fixed2",
				label: messages[language].FIXED2
			},
			{
				value: "fixed3",
				label: messages[language].FIXED3
			},
			{
				value: "fixed4",
				label: messages[language].FIXED4
			},
			{
				value: "fixed5",
				label: messages[language].FIXED5
			},
			{
				value: "fixed7",
				label: messages[language].FIXED7
			}
			],
			defaultValue: "random2"
	};
	
	messages[language].MIN_TEXT_SIZE = "Tamanho Mínimo Texto";
	var minTextSize = {
			type: "integer",
			label: messages[language].MIN_TEXT_SIZE,
			ref: "minTextSize",
			component: "slider",
			min: 5,
			max: 200,
			step: 1,			
			//expression: "always",
			defaultValue: 15
	};	

	messages[language].MAX_TEXT_SIZE =  "Tamanho Máximo Texto";
	var maxTextSize = {
			type: "integer",
			label: messages[language].MAX_TEXT_SIZE,
			ref: "maxTextSize",
			component: "slider",
			min: 1,
			max: 20,
			step: 0.5,			
			//expression: "always",
			defaultValue: 4
	};	
	
	
	messages[language].ANALOGUE1 =  "Análogas 1";
	messages[language].ANALOGUE2 =  "Análogas 2";
	messages[language].YELLOWRED =  "Amarelo->Vernelho";
	messages[language].WHITEBLUE =  "Branco->Azul";
	messages[language].COLORS= "Cores";
	messages[language].STANDARD_QS= "Padrão QS"
	messages[language].COLORED= "Colorido";
	messages[language].BRAZIL= "Brasil";	
	var palette = {
			type: "string",
			component: "dropdown",
			label: messages[language].COLORS,
			ref: "palette",
			options: [{
				value: "standard",
				label: messages[language].STANDARD_QS
			},{
				value: "colored",
				label: messages[language].COLORED
			},{
				value: "analogue1",
				label: messages[language].ANALOGUE1
			},{
				value: "analogue2",
				label: messages[language].ANALOGUE2
			},{
				value: "yellowRed",
				label: messages[language].YELLOWRED
			},{
				value: "whiteBlue",
				label: messages[language].WHITEBLUE
			},{
				value: "brazil",
				label: messages[language].BRAZIL
			}
			
			],
			defaultValue: "analogue1"
	};		

	messages[language].BOLD = "Negrito";
	messages[language].NORMAL = "Normal";
	var bold = {
			type: "string",
			component: "dropdown",
			label: messages[language].BOLD,
			ref: "bold",
			options: [{
				value: "normal",
				label: messages[language].NORMAL
			},{
				value: "bold",
				label: messages[language].BOLD
			}
			
			],
			defaultValue: "bold"
	};	


	messages[language].CAPITALIZE = "Capitalizar";
	messages[language].UPPER = "Maiúsculas";
	
	var capitalize = {
			type: "string",
			component: "dropdown",
			label: messages[language].CAPITALIZE,
			ref: "capitalize",
			options: [{
				value: "capitalize",
				label: messages[language].CAPITALIZE
			},{
				value: "upper",
				label: messages[language].UPPER
			}
			
			],
			defaultValue: "upper"
	};		
	
	messages[language].BORDER = "Borda";
	messages[language].YES = "Sim";
	messages[language].NO = "Não";
	
	var border = {
		type: "boolean",
		component: "switch",
		label: messages[language].BORDER,
		ref: "border",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false
	};	
	messages[language].GRID = "Grid";
/*	var grid = {
		type: "boolean",
		component: "switch",
		label: messages[language].GRID,
		ref: "grid",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: true
	};	*/	
	var grid = {
			type: "integer",
			//component: "switch",
			label: messages[language].GRID,
			ref: "grid",
			defaultValue: 1,
			min: 0,
			max: 200
		};	
		
	messages[language].GRID_RADIALS="Divisórias";
	var gridRadials = {
			type: "integer",
			//component: "switch",
			label: messages[language].GRID_RADIALS,
			ref: "gridRadials",
			defaultValue: null,
			min: 0,
			max: 200
		};	
	

	
	messages[language].AXES = "Eixos";
	var axes = {
		type: "boolean",
		component: "switch",
		label: messages[language].AXES,
		ref: "axes",
		options: [{
			value: true,
			label: messages[language].YES
		}, {
			value: false,
			label: messages[language].NO
		}],
		defaultValue: false
	};		
	
	messages[language].BACKGROUND_COLOR = "Cor de Fundo";
	var backgroundColor = {
			type: "string",
			label: messages[language].BACKGROUND_COLOR,
			ref: "backgroundColor",
			component:"color-picker",
			//expression: "always",
			defaultValue: "#ffffff"
	};	
	
	/*
	var keepColors = {
			type: "boolean",
			component: "switch",
			label: messages[language].KEEP_COLORS,
			ref: "keepColors",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: false
	};		*/
	
	messages[language].SHOW_LABELS="Show Labels";

	var chartLabels = {
			type: "boolean",
			component: "switch",
			label: messages[language].SHOW_LABELS,
			ref: "chartLabels",
			options: [{
				value: true,
				label: messages[language].ON
			}, {
				value: false,
				label: messages[language].OFF
			}],
			defaultValue: true
	};
	
	messages[language].LABEL_TEXT_SIZE="Label Text Size";

	var labelTextSize = {
		type: "integer",
		label: messages[language].LABEL_TEXT_SIZE,
		ref: "labelTextSize",
		component: "slider",
		min: 10,
		max: 200,
		step: 1,			
		//expression: "always",
		defaultValue: 100
	};		
	
	
	messages[language].ITEM_OPTIONS="Opções";
	var Options = {
		type:"items",
		label:messages[language].ITEM_OPTIONS,
		items: {			
			//rotateType:rotateType,
			//minTextSize:minTextSize,
			//maxTextSize:maxTextSize,
			//bold:bold,
			//capitalize:capitalize,
			palette:palette,
			//border:border,
			grid:grid,
			gridRadials:gridRadials,
			axes:axes,
			backgroundColor:backgroundColor,
			chartLabels,
			labelTextSize
			
			//,keepColors:keepColors

			//,thousandSeparator:thousandSeparator
			//,decimalSeparator:decimalSeparator
		}
	
	};
	
	messages[language].STEP_SCALE = "Passos da Escala";
	var stepScale = {
		type: "integer",
		//component: "switch",
		label: messages[language].STEP_SCALE,
		ref: "stepScale",
		defaultValue: "5",
		min: "0",
		max: "200"
	};

	
	messages[language].UP_AXE_ESCALE = "Escala Eixo Em Cima"
	var upScale = {
		type: "string",
		component: "switch",
		label: messages[language].UP_AXE_ESCALE,
		ref: "upScale",
		options: [{
			value: "n",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: "n"
	};

	messages[language].DOWN_AXE_ESCALE = "Escala Eixo Em Baixo"
	var downScale = {
		type: "string",
		component: "switch",
		label: messages[language].DOWN_AXE_ESCALE,
		ref: "downScale",
		options: [{
			value: "s",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: ""
	};	

	messages[language].LEFT_AXE_ESCALE = "Escala Eixo Esquerda"
	var leftScale = {
		type: "string",
		component: "switch",
		label: messages[language].LEFT_AXE_ESCALE,
		ref: "leftScale",
		options: [{
			value: "w",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: ""
	};	

	messages[language].RIGHT_AXE_ESCALE = "Escala Eixo Direita"
	var rightScale = {
		type: "string",
		component: "switch",
		label: messages[language].RIGHT_AXE_ESCALE,
		ref: "rightScale",
		options: [{
			value: "e",
			label: messages[language].YES
		}, {
			value: "",
			label: messages[language].NO
		}],
		defaultValue: ""
	};	
	
	messages[language].ITEM_SCALE="Escala";
	var Scale = {
		type:"items",
		label:messages[language].ITEM_SCALE,
		items: {
			stepScale:stepScale,			
			upScale:upScale,
			downScale:downScale,
			leftScale:leftScale,
			rightScale:rightScale
		}
	
	};	
	
	
	messages[language].CHART_RADIUS_SIZE = "Raio";
	var chartRadius = {
			type: "integer",
			label: messages[language].CHART_RADIUS_SIZE,
			ref: "chartRadius",
			component: "slider",
			min: 10,
			max: 200,
			step: 1,			
			//expression: "always",
			defaultValue: 75
	};
	
	messages[language].ITEM_SIZE = "Tamanho"
	var chartSize = {
		type:"items",
		label:messages[language].ITEM_SIZE,
		items: {
			chartRadius:chartRadius
			//,
			//donutWidth:donutWidth		

		}
	
	};
	
	messages[language].LEGEND_POSITION_HORIZONTAL="Posição Horizontal";
	var keyPositionX = {
			type: "integer",
			label: messages[language].LEGEND_POSITION_HORIZONTAL,
			ref: "keyPositionX",
			component: "slider",
			min: -300,
			max: 300,
			step: 3,
			//expression: "always",
			defaultValue: 0
	};	
	
	messages[language].LEGEND_POSITION_VERTICAL="Posição Vertical";
	var keyPositionY = {
			type: "integer",
			label: messages[language].LEGEND_POSITION_VERTICAL,
			ref: "keyPositionY",
			component: "slider",
			min: -300,
			max: 300,
			step: 1,
			//expression: "always",
			defaultValue: 3
	};		


	
	messages[language].SHOW_LEGENDS="Mostrar Legenda";
	messages[language].SHOW="Mostrar";
	messages[language].DONT_SHOW="Não Mostrar";

	var showLegends = {
			type: "boolean",
			component: "switch",
			label: messages[language].SHOW_LEGENDS,
			ref: "showLegends",
			options: [{
				value: true,
				label: messages[language].SHOW
			}, {
				value: false,
				label: messages[language].DONT_SHOW
			}],
			defaultValue: false
	};

	
	messages[language].ORIENTATION="Orientação";
	messages[language].VERTICAL="Vertical";
	messages[language].HORIZONTAL="Horizontal";
	var graphGutter = {
			type: "string",
			component: "switch",
			label: messages[language].ORIENTATION,
			ref: "graphGutter",
			options: [{
				value: "graph",
				label: messages[language].VERTICAL
			}, {
				value: "gutter",
				label: messages[language].HORIZONTAL
			}],
			defaultValue: "graph"
	};	

	messages[language].ITEM_LEGENDS="Legenda";
	//messages[language].ITEM_LABELS="Labels";
	var legends = {
		type:"items",
		//component: "accordion",
		label:messages[language].ITEM_LEGENDS,
		items: {			
			showLegends:showLegends,
			graphGutter:graphGutter,
			keyPositionX:keyPositionX,
			keyPositionY:keyPositionY
			
		}
	
	};
	
	messages[language].CHART_POSITION_VERTICAL="Vertical";
	var gutterTop = {
			type: "integer",
			label: messages[language].CHART_POSITION_VERTICAL,
			ref: "gutterTop",
			component: "slider",
			min: -20,
			max: 100,
			step: 1,
			//expression: "always",
			defaultValue: 30
	};
	
	messages[language].CHART_POSITION_HORIZONTAL="Horizontal";
	var gutterLeft = {
			type: "integer",
			label: messages[language].CHART_POSITION_HORIZONTAL,
			ref: "gutterLeft",
			component: "slider",
			min: -20,
			max: 200,
			step: 1,
			//expression: "always",
			defaultValue: 90
	};

	messages[language].ITEM_POSITION="Posição";	
	var Position = {
		type:"items",
		//component: "expandable-items",
		label:messages[language].ITEM_POSITION,
		items: {
			gutterTop:gutterTop,
			gutterLeft:gutterLeft
			//,rotateUpFor:rotateUpFor
		}
	
	};	


	
	messages[language].EXPANDABLE_ITEM_OPTIONS = "Opções";
	var optionsSizeBorders = {
		//type:"items",
		component: "expandable-items",
		label:messages[language].EXPANDABLE_ITEM_OPTIONS,
		items: {			
			Options:Options,
			Position:Position,
			chartSize:chartSize,
			legends:legends,
			Scale:Scale
			
		}
	
	};		
	
    // *****************************************************************************
    // Main property panel definition
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************
	  
	//******************************************************************************

    return {
        type: "items",
        component: "accordion",
        items: {
            //Default Sections
			dimensions: dimensions,
            measures: measures,
            appearance: appearanceSection,
			sorting: sortingSection,
			//Custom Sections
			optionsSizeBorders:optionsSizeBorders//,
			

        }
    };

} );

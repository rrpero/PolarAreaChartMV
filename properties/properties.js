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
	var grid = {
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
			backgroundColor:backgroundColor
			//,keepColors:keepColors

			//,thousandSeparator:thousandSeparator
			//,decimalSeparator:decimalSeparator
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
	
	messages[language].EXPANDABLE_ITEM_OPTIONS = "Opções";
	var optionsSizeBorders = {
		//type:"items",
		component: "expandable-items",
		label:messages[language].EXPANDABLE_ITEM_OPTIONS,
		items: {			
			Options:Options,
			chartSize:chartSize
			
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

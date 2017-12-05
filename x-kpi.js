define(["qlik", "text!./template.html",
        './extUtils', "text!./style.css", 'ng!$q', 
    'ng!$http'
    ],
    function(qlik, template, extUtils, css, $q, $http) {

        var faUrl = extUtils.getBasePath() + '/extensions/sheet-nav/lib/external/fontawesome/css/font-awesome.min.css';
        extUtils.addStyleLinkToHeader(faUrl, 'sheet-nav__fontawesome');


        $("<style id='kip'>").html(css).appendTo("head");


        var app = qlik.currApp();

        var getSheetList = function() {

            var defer = $q.defer();

            app.getAppObjectList(function(data) {
                var sheets = [];
                var sortedData = _.sortBy(data.qAppObjectList.qItems, function(item) {
                    return item.qData.rank;
                });
                _.each(sortedData, function(item) {
                    sheets.push({
                        value: item.qInfo.qId,
                        label: item.qMeta.title
                    });
                });
                return defer.resolve(sheets);
            });

            return defer.promise;
        };
		

        return {
            definition: {
                type: "items",
                component: "accordion",
                items: {
					custom:{
						label:'Custom Settings',
						 items: {

								bgcolor: {
									type: "string",
									ref: "bgcolor",
									label: "Background color",
									expression: "optional"
								},
								title: {
									type: "string",
									ref: "title",
									label: "Title",
									expression: "optional"
                            	},
								
								ashtml1: {
									ref : "ashtml1",
									label : "Add HTML",
									type : "boolean",
									defaultValue : false
								},
								
								icon: {
									type: "string",
									ref: "iconname",
									label: "Icon Name",
									expression: "optional"
                            	},
								
								
							}
					},
					
					val1:{
						label:'Main KPI Expression',
						 items: {
						 	value1: {
                                type: "string",
                                ref: "value1",
                                label: "Value Exp",
                                expression: "optional"
                            },
                            
						 }
					},
					val2:{
						label:'Alternative Expression',
						 items: {
							value2txt: {
                                type: "string",
                                ref: "value2txt",
                                label: "Expression 2 Text",
                                expression: "optional"
                            },
							
							ashtml2: {
									ref : "ashtml2",
									label : "Add HTML",
									type : "boolean",
									defaultValue : false
								},
								
								
						 	value2icon: {
                                type: "string",
                                ref: "value2icon",
                                label: "Expression 2 icon",
                                expression: "optional"
                            },
						 }
					},
					
					navtosheet:{
						label:'Navigation',
						 items: {
                            sheetlst: {
                                type: "string",
                                component: "dropdown",
                                label: "Select Sheet",
                                ref: "gotosheet",
                                options: function() {
                                    return getSheetList().then(function(items) {
                                        return items;
                                    });
                                }
                            },
						 }
					},
					
                    settings: {
                        uses: "settings",
                        items: {
						
							
							linkforiconpack: {
                                    	type: "string",
                                    	ref: "linkforiconpack",
                                    	label: "Link For Icon Pack",
                                    	expression: "optional"
                           },
							
                            		/*
									navtosheet: {
                                    	type: "string",
                                    	ref: "gotosheet",
                                    	label: "Go To Sheet",
                                    	expression: "optional"
                                    },
									*/

                            //end


                        }
                    }
                }
            },
            //template: template,
            support: {
                snapshot: false,
                export: false,
                exportData: false
            },
            paint: function(element, layout) {


				if(layout.linkforiconpack == ''){
				
				}else{
					if($('#exticonpack_kpi1').length > 0){

						$('link#exticonpack_kpi1').remove();
						$('<link id="exticonpack_kpi1" rel="stylesheet" href="'+layout.linkforiconpack+'">').appendTo('head');              

					}else{
						$('<link id="exticonpack_kpi1" rel="stylesheet" href="'+layout.linkforiconpack+'">').appendTo('head');             
					}
				}
				
				
                var html = '';

                html += '<div>';
                html += '<a class="dashboard-stat dashboard-stat-v2 bg-color" style="background-color: ' + layout.bgcolor + ';" ';
                html += 'href="javascript:;" id="gotosheet_' + layout.gotosheet + '">';
                html += '<div><p class="MainCardHdr">' + layout.title + '</p></div>';
                html += '  <div class="visual">';
                
				if(layout.ashtml1){
					html += layout.iconname;
				}else{
					html += '      <i class="' + layout.iconname + '"></i>';
                }
				
				html += '  </div>';
                html += '   <div class="details">';
                html += '      <div class="stat-number">';
                html += '          <span  class="stat-value1">' + layout.value1 + '</span>';
                html += '      </div>';
                html += '      <div class="desc"> ' + layout.value2txt;
				
				if(layout.ashtml2){
					html += layout.value2icon;
				}else{
					html +='	<i class="' + layout.value2icon + ' custIcn" ></i>';
                }
				
				html += '  </div></div>';
                html += ' </a>';
                html += ' </div>';


                element.html(html);


				var result = qlik.navigation.getMode();
				if(result == 'analysis'){
					console.log('ANALYSIS');
					$('#gotosheet_' + layout.gotosheet).click(function() {
						console.log('click');
						qlik.navigation.gotoSheet(layout.gotosheet);
                	});
				 };
				

                $('.qv-object-x-kip .qv-object-header.thin').hide();

                /*
                $( '#gotosheet_'+layout.gotosheet ).dblclick(function() {
                  	
                });
                */



                //qlik.navigation.gotoSheet(layout.gotosheet);
                //return qlik.Promise.resolve();
            },
            controller: ['$scope', function($scope) {
                //add your rendering code here


            }]
        };

    });
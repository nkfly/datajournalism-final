function year_data(year,year_value){
	this.year = year;
	this.year_value = year_value;
	this.month = [];
	this.die = null;
	this.hurt = null;
}
function county_data(name){
	this.name = name;
	this.year = [];
	this.sum_of_die = 0;
	this.sum_of_fire = 0;
}

function get_county(data){
	var county = [];
        var tmp = d3.entries(data[0]);
	for(var i=1;i<tmp.length;i++){
		county.push(tmp[i].key);
	}
	return county;
}
function draw_graph(month_csv,die_csv,hurt_csv,json){
	var width = 800;
	var height = 500;
	var width_map = 600;
	var result = process_data(month_csv,die_csv,hurt_csv);
	var county = result[0];
	var year_list = result[1];
	var svg = d3.select("#svg1")
		.attr("width",width)
                .attr("height",height);
	///show all
	var local_height = Math.floor(height/Math.ceil(county.length/5));
	var local_width = width/5;
	var padding = 10;
	var xScale = d3.scale.linear();
	var container_list = [];
        xScale.domain([0,result[2]]).range([0,local_height/3]);
	var xScale2 = d3.scale.linear();
        xScale2.domain([0,result[3]]).range([0,local_height/3]);
	//////draw big graph
	var zoom_height = height*(1/2);
	var text_height = 100;
	var graph_note_height = 100;
	var zoom_top = height-zoom_height-graph_note_height;
	var zoom_width = (width/5)*2;
	var zoom_padding = 20;
	var zoom_border = 10;
	var zoom_county = append_background(svg,"zoom_background",text_height,0,height-text_height,zoom_width-zoom_padding,graph_note_height);
	var zoom = append_container(svg,"zoom",zoom_top,0+zoom_border,zoom_height,(zoom_width-zoom_padding-2*zoom_border));
	local_width = (width-zoom_width)/5;
	var zoomScale = d3.scale.linear();
	var zoomScale2 = d3.scale.linear();
	zoomScale.domain([0,result[2]]).range([0,zoom_height/3]);
	zoomScale2.domain([0,result[3]]).range([0,zoom_height/3]);
	//for reverse axix
	var rev_scale = d3.scale.linear();
        rev_scale.domain([0,result[2]]).range([zoom_height/3,0]);
	///
	var zoom_poly = draw_poly(zoom,0,0,zoom_height/3,zoom_width-zoom_padding-2*zoom_border,county[0],zoomScale,rev_scale);
        var zoom_rect = draw_rect(zoom,zoom_height/3,0,zoom_height/3,zoom_width-zoom_padding-2*zoom_border,county[0],year_list);
        var zoom_reverse_poly = draw_reverse_poly(zoom,(zoom_height/3)*2,0,zoom_height/3,zoom_width-zoom_padding-2*zoom_border,county[0],zoomScale2);
	var zoom_in = {};
        zoom_in.update = function(county_name){
		for(var i=0;i<county.length;i++){
			if(county[i].name == county_name){
				zoom_county.update(county[i]);
				zoom_poly.update(county[i]);
				zoom_rect.update(county[i]);
				zoom_reverse_poly.update(county[i]);
				break;
			}
		}
	}
	zoom_in.update("新北市");
	//////draw each county graph
	for(var i=0;i<county.length;i++){
		container_list.push(append_container(svg,county[i].name,Math.floor(i/5)*local_height,(i%5)*local_width+zoom_width,local_height,local_width,zoom_in));
		var tmp = container_list[container_list.length-1];
		draw_poly(tmp,0,0,local_height/3,local_width-padding,county[i],xScale);
		draw_rect(tmp,local_height/3,0,local_height/3,local_width-padding,county[i],year_list);
		draw_reverse_poly(tmp,(local_height/3)*2,0,local_height/3,local_width-padding,county[i],xScale2);
	}
	//move_to(container_list[5],0,0);
	var sorted_array = sort_calculation(county);
	d3.select("#select1")
		.on("change",function(){
			var selectedIndex = d3.select("#select1").property('selectedIndex');
			for(var i=0;i<sorted_array[selectedIndex].length;i++){
                		for(var j=0;j<container_list.length;j++){
                        		if(sorted_array[selectedIndex][i] == container_list[j].attr("id")){
                                		move_to(container_list[j],Math.floor(i/5)*local_height,(i%5)*local_width+zoom_width);
                        			break;
					}
                		}		
        		}
		});
}
function sort_by(container_list,sort_array){
	for(var i=0;i<sort_array.length;i++){
		for(var j=0;j<container_list.length;j++){
			if(sort_array[i] == container_list[j].attr("id")){
				move_to(container_list[j],Math.floor(i/5)*local_height,(i%5)*local_width+zoom_width);
			}
		}
	}
}
function move_to(container,top_pos,left_pos){
	container
		.attr("x",left_pos)
		.attr("y",top_pos);
}
function swap(array,i,j){
	var tmp = array[i];
	array[i] = array[j];
	array[j] = tmp;
}
function sort_calculation(county_data){
	var sort_die = [];
	var sort_county = [];
	var sort_fire = [];
	var tmp_die = [];
	var tmp_fire = [];
	for(var i=0;i<county_data.length;i++){
		sort_county.push(county_data[i].name);
		sort_die.push(county_data[i].name);
		tmp_die.push(county_data[i].sum_of_die);
		//alert("fuck");
		for(var j=sort_die.length-1;j>0;j--){
			if(j == 0)
				break
			if(tmp_die[j]>tmp_die[j-1]){
				swap(tmp_die,j,j-1);
				swap(sort_die,j,j-1);
			}
			else
				break;
		}
		sort_fire.push(county_data[i].name);
                tmp_fire.push(county_data[i].sum_of_fire);
                for(var j=sort_fire.length-1;j>0;j--){
                        if(tmp_fire[j]>tmp_fire[j-1]){
                                swap(tmp_fire,j,j-1);
                                swap(sort_fire,j,j-1);
                        }
                        else
                                break;
                }
	}
	/*
	d3.select("#select1")
		.on("change",function(){
			var selectedIndex = d3.select("#select1").property('selectedIndex');
			alert(selectedIndex);
		})
	*/
	//alert(sort_county);
	return [sort_county,sort_fire,sort_die];
}
function append_background(svg,id,top_pos,left_pos,height,width,note_height){
	var rect_size = 10;
	var title_size = 15;
	var county_size = 20;
	var rect_padding = 5;
	var value_list = [1,26,76,151,251];
	var stat_size = 12;
	svg.append("rect")
		.attr("x",left_pos)
		.attr("y",top_pos)
		.attr("height",height)
		.attr("width",width)
		.style("fill","#C9BC9C");
	var county_now = svg.append("text")
                        .attr("x",left_pos)
                        .attr("y",top_pos+county_size)
                        .style("font-size",county_size)
			.style("font-weight","bold")
                        .text("新北市");
	var county_die = svg.append("text")
			.attr("x",left_pos + 150)
                        .attr("y",top_pos+stat_size*2)
			.style("fill","#92302B")
                        .style("font-size",stat_size);
	var county_hurt = svg.append("text")
			.attr("x",left_pos + 150)
                        .attr("y",top_pos+stat_size*3)
			.style("fill","#C68837")
                        .style("font-size",stat_size);
	var pl = {};
	pl.update = function(county_data){
		var county_name = county_data.name;
		var die = 0;
		var hurt = 0;
		for(var i=0;i<county_data.year.length;i++){
			die += county_data.year[i].die;
			hurt += county_data.year[i].hurt;
		}
		county_die.text("累計火災死亡人數"+die.toString()+"人")
				.style("color","red");
		county_hurt.text("累計火災受傷人數"+hurt.toString()+"人");
		county_now.text(county_name);
	}
	svg.append("text")
		.attr("x",left_pos+3*rect_padding)
                .attr("y",top_pos+height-note_height + title_size + rect_padding)
		.style("font-size",title_size)
		.style("font-weight","bold")
		.text("火災發生次數");
		
	for(var i=0;i<5;i++){
		svg.append("rect")
			.attr("x",left_pos+3*rect_padding)
			.attr("y",top_pos+height-note_height + i*(rect_size+rect_padding) + rect_size + title_size)
			.attr("width",rect_size)
			.attr("height",rect_size)
			.style("z-index",2)
			.style("fill",function(){
				return color_mapping(value_list[i]);
			});
		svg.append("text")
			.attr("x",left_pos+3*rect_padding + rect_size+rect_padding)
                        .attr("y",top_pos+height-note_height + i*(rect_size+rect_padding) + rect_size*2 +title_size)
			.style("font-size",rect_size)
			.text(function(){
				if(i<4)
					return value_list[i].toString()+ "-" + value_list[i+1].toString();
				else
					return "大於" + value_list[i].toString();
			});
	}
	return pl;
}
function append_container(svg,id,top_pos,left_pos,height,width,zoom_change){
	if(id == "zoom"){
		svg.append("rect")
			.attr("x",left_pos)
                	.attr("y",top_pos)
                	.attr("height",height)
                	.attr("width",width)
			.style("fill","#C9BC9C");
	}
	var new_svg = svg.append("svg")
		.attr("id",id)
		.attr("x",left_pos)
		.attr("y",top_pos)
		.attr("height",height)
		.attr("width",width)
		.style("cursor",function(){
			if(id != "zoom")
				return "pointer";
		})
		.on("mouseover",function(){
			if(id != "zoom"){
			d3.select(this)
				.style("opacity",0.5);
			}
		})
		.on("mouseout",function(){
                        d3.select(this)
                                .style("opacity",1.0);
                })
		.on("click",function(){
			if(id != "zoom"){
				zoom_change.update(id);
			}
		});
	return new_svg;
}
function mouseover(county_data,position){
	var year = county_data.year;
	var hurt = county_data.hurt.toString();
	var die = county_data.die.toString();
	var times = 0;
	for(var j=0;j<county_data.month.length;j++){
		times += county_data.month[j];
	}
	times = times.toString();
	var x = position[0];
	var y = position[1]+120;
	d3.select("#tooltip1")
		.style("display","block")
		.style("top",y.toString()+"px")
		.style("left",x.toString()+"px");
	d3.select("#year")
		.text(year);
	d3.select("#die")
		.text("死亡人數:"+die);
	d3.select("#times")
		.text("火災次數"+times);
	d3.select("#hurt")
		.text("受傷人數:"+hurt);
	
}
function mouseout(){
	d3.select("#tooltip1")
		.style("display","None");
}
function change_data(rect,poly,county_data){
	rect.update(county_data);
	poly.update(county_data);
}
function draw_map(svg,json,county,rect,poly){
	var prj = d3.geo.mercator().center([121.5, 24.6]).scale(6000);
        var path = d3.geo.path().projection(prj);
        var g = svg.append("g");
	var map = svg.selectAll("path")
		.data(json.features)
                .enter()
                .append("path")
                .attr("d",path)
		.on("click",function(d){
			svg.selectAll("path")
				.style("opacity",1.0);
			d3.select(this)
				.style("opacity",0.5);
			for(var i=0;i<county.length;i++){
				if(county[i].name == d.properties.county){
					change_data(rect,poly,county[i]);
					break;
				}
			}
		});

}
function generate_poly_data(county_data){
	var poly_data = [];
        for(var i=0;i<county_data.year.length;i++){
                poly_data.push(county_data.year[i].die);
        }
	return poly_data;
}
function generate_hurt_data(county_data){
        var poly_data = [];
        for(var i=0;i<county_data.year.length;i++){
                poly_data.push(county_data.year[i].hurt);
        }
        return poly_data;
}
function draw_poly(svg,top_pos,left_pos,height,width,county_data,xScale,rev_scale){
	var padding = 1;
	var poly_data = generate_poly_data(county_data);
	var scale_width = 30;
	if(svg.attr("id") == "zoom"){
		width -= scale_width*2;
		left_pos += scale_width;
		var axis_left = width + scale_width;
		var yAxis = d3.svg.axis()
			.scale(rev_scale)
			.ticks(3)
			.orient("right");
		svg.append("g")
                        .style("font-size","9px")
                        .attr("transform", "translate(" +axis_left+ "," + top_pos + ")")
                        .call(yAxis);
	}
	var poly = svg.selectAll("rect.poly")
		.data(poly_data)
		.enter()
		.append("rect")
		.attr("class","poly")
		.attr("x",function(d,i){
			return i*(width/poly_data.length)+left_pos;
		})
		.attr("y",function(d){
			return top_pos+height-xScale(d);
		})
		.attr("width",(width/poly_data.length)-padding)
		.attr("height",function(d){
			return xScale(d);
		})
		.style("fill","#92302B")
		.on("mouseover",function(d,i){
			if(svg.attr("id") == "zoom"){
				mouseover(county_data.year[i],d3.mouse(this));
			}
		})
		.on("mouseout",mouseout);
	var pl = {};
        pl.update = function(county_data2){
		var poly_data2 = generate_poly_data(county_data2);
		poly.data(poly_data2)
			.transition()
			.duration(500)
			.attr("y",function(d){
                        	return top_pos+height-xScale(d);
                	})
                	.attr("height",function(d){
                        	return xScale(d);
                	});
		svg.selectAll("rect.poly")
			.on("mouseover",function(d,i){
                        	if(svg.attr("id") == "zoom"){
                                	mouseover(county_data2.year[i],d3.mouse(this));
                        	}
                	});
	}
	return pl;
}
function draw_reverse_poly(svg,top_pos,left_pos,height,width,county_data,xScale){
        var padding = 1;
	var text_height = 15;
	height = height - text_height;
	 var scale_width = 30;
        if(svg.attr("id") == "zoom"){
                width -= scale_width*2;
                left_pos += scale_width;
		var axis_left = width+scale_width;
		var yAxis = d3.svg.axis()
                        .scale(xScale)
                        .ticks(3)
                        .orient("right");
			//.attr("transform", "translate(0," + top_pos + ")");
                svg.append("g")
			.style("font-size",9)
			.attr("transform", "translate(" +axis_left+ "," + top_pos + ")")
                        .call(yAxis);
        }
        var poly_data = generate_hurt_data(county_data);
        
        var poly = svg.selectAll("rect.poly_r")
                .data(poly_data)
                .enter()
                .append("rect")
		.attr("class","poly_r")
                .attr("x",function(d,i){
                        return i*(width/poly_data.length)+left_pos;
                })
                .attr("y",function(d){
                        return top_pos;//+height-xScale(d);
                })
                .attr("width",(width/poly_data.length)-padding)
                .attr("height",function(d){
                        return xScale(d);
                })
                .style("fill","#C68837")
		.on("mouseover",function(d,i){
                        if(svg.attr("id") == "zoom"){
                                mouseover(county_data.year[i],d3.mouse(this));
                        }
                })
                .on("mouseout",mouseout);
	if(svg.attr("id") != "zoom"){
	var text = svg.append("text")
                        .text(county_data.name)
                        .style("position","absolute")
                        .attr("x",left_pos)
                        .attr("y",top_pos+height+text_height-2)
                        .style("font-size",function(){
				if(svg.attr("id")=="zoom")
					return 20;
				else
					return 11;
			})
                        .style("color","black");
	}
        var pl = {};
        pl.update = function(county_data2){
                var poly_data2 = generate_hurt_data(county_data2);
                poly.data(poly_data2)
                        .transition()
                        .duration(500)
                        .attr("y",function(d){
                                return top_pos;//+height-xScale(d);
                        })
                        .attr("height",function(d){
                                return xScale(d);
                        });
		svg.selectAll("rect.poly_r")
			.on("mouseover",function(d,i){
                        	if(svg.attr("id") == "zoom"){
                                	mouseover(county_data2.year[i],d3.mouse(this));
                        	}
                	});
	}
        return pl;
}

function generate_rect_data(county_data){
	var rect_data = [];
	for(var i=0;i<county_data.year.length;i++){
		for(var j=0;j<county_data.year[i].month.length;j++){
			rect_data.push(county_data.year[i].month[j]);
		}
	}
	return rect_data;
}
function color_mapping(value){
	if(value == 0)
		return "white";
	else if(value>0 && value<=25)
		return "#D6D6D7";
	else if(value>25 &&value<=75)
		return "#9F9FA0";
	else if(value>75 && value<=150)
		return "#888889";
	else if(value>150 && value<=250)
		return "#717071";
	else if(value>250)
		return "#595757";
}
function draw_rect(svg,top_pos,left_pos,height,width,county_data,year_list){
	var rect_data = generate_rect_data(county_data);
	var scale_width = 30;
        if(svg.attr("id") == "zoom"){
                width -= scale_width*2;
                left_pos += scale_width;
		var month_text_size = 10;
		svg.append("text")
			.attr("x",left_pos-2*month_text_size)
			.attr("y",top_pos+month_text_size)
			.style("font-size",month_text_size)
			.text("1月");
		svg.append("text")
                        .attr("x",left_pos-2*month_text_size)
                        .attr("y",top_pos+height)
                        .style("font-size",month_text_size)
                        .text("12月");
        }

	var year_rect = svg.selectAll("rect.rect")
				.data(rect_data)
				.enter()	
				.append("rect")
				.attr("class","rect")
				.attr("x",function(d,i){
					return left_pos+(Math.floor(i/12))*(width/year_list.length);
				})
				.attr("y",function(d,i){
					return top_pos+(i%12)*(height/12);
				})
				.attr("width",width/year_list.length)
				.attr("height",(height/12))
				.style("stroke-width",0)
				.style("fill",function(d){
					return color_mapping(d);
				})
				.on("mouseover",function(d,i){
                	                if(svg.attr("id") == "zoom"){
                        	                mouseover(county_data.year[Math.floor(i/12)],d3.mouse(this));
                        	        }
		                })
				.on("mouseout",mouseout);
	var rc = {};
	rc.update = function(county_data2){
		var rect_data2 = generate_rect_data(county_data2);
		year_rect.data(rect_data2)
			.transition()
			.duration(500)
                	.style("fill",function(d){
                                     	return color_mapping(d);
                                });
		
		svg.selectAll("rect.rect")
			.on("mouseover",function(d,i){
                                if(svg.attr("id") == "zoom"){
                                        mouseover(county_data2.year[Math.floor(i/12)],d3.mouse(this));
                                }
                        });
	}
	return rc;
}
function process_data(month_csv,die_csv,hurt_csv){
	var county_names = get_county(month_csv);
        var county = [];
	var year_list = [];
        for(var i=0;i<county_names.length;i++){
                county.push(new county_data(county_names[i]));
        }
	
        for(var i=0;i<month_csv.length;i++){
                var tmp = d3.entries(month_csv[i]);
                if(month_csv[i].month[month_csv[i].month.length-1] == "年"){
			year_list.push(tmp[0].value);
                        for(var j=0;j<county.length;j++){
                                county[j].year.push(new year_data(tmp[0].value,parseInt(tmp[j+1].value)));
				county[j].sum_of_fire += parseInt(tmp[j+1].value);
                        }
                }
                else if(month_csv[i].month[month_csv[i].month.length-1] == "月"){
			for(var j=0;j<county.length;j++){
				var length = county[j].year.length;
				county[j].year[length-1].month.push(parseFloat(tmp[j+1].value));
			}
                }
        }
	var max = 0;
	var max2 = 0;	
	for(var i=0;i<die_csv.length;i++){
		var tmp = d3.entries(die_csv[i]);
		for(var j=1;j<tmp.length;j++){
			for(var k=0;k<county.length;k++){
				if(county[k].name == tmp[j].key){
					county[k].year[i].die = parseInt(tmp[j].value);
					county[k].sum_of_die += parseInt(tmp[j].value);
					if(parseInt(tmp[j].value)>max){
						max = parseInt(tmp[j].value);
					}
					break;
				}
			}
		}
	}
	for(var i=0;i<hurt_csv.length;i++){
                var tmp = d3.entries(hurt_csv[i]);
                for(var j=1;j<tmp.length;j++){
                        for(var k=0;k<county.length;k++){
                                if(county[k].name == tmp[j].key){
                                        county[k].year[i].hurt = parseInt(tmp[j].value);
					if(parseInt(tmp[j].value)>max2){
                                                max2 = parseInt(tmp[j].value);
                                        }
                                        break;
                                }
                        }
                }
        }	
	//test for data correctness
	/*
	for(var i=0;i<county.length;i++){
		alert(county[i].name);
		alert(county[i].year[0].year);
		alert(county[i].year[0].die);
		alert(county[i].year[0].year_value);
		alert(county[i].year[0].month);
		
	}
	*/
	return [county,year_list,max,max2];
}

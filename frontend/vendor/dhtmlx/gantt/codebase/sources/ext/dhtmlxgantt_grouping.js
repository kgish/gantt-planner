/*
@license

dhtmlxGantt v.4.2.0 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._groups = {
	relation_property: null,
	relation_id_property: '$group_id',
	group_id:null,
	group_text:null,
	loading: false,
	loaded:0,
	init: function(gantt){
		var self = this;

		gantt.attachEvent("onClear", function(){
			self.clear();
		});
		self.clear();

		var originalGetParent =  gantt._get_parent_id;
		gantt._get_parent_id = function(task){
			if(self.is_active()){
				return self.get_parent(gantt, task);
			}else{
				return originalGetParent.apply(this, arguments);
			}
		};

		var originalSetParent = gantt.setParent;
		gantt.setParent = function(task, new_pid){
			if(!self.is_active()){
				return originalSetParent.apply(this, arguments);
			}else if(gantt.isTaskExists(new_pid)){
				var parent = gantt.getTask(new_pid);
				task[self.relation_property] = parent[self.relation_id_property];
			}
		};

		gantt.attachEvent("onBeforeTaskDisplay", function(id, task){
			if(self.is_active()){
				if(task.type == gantt.config.types.project && !task.$virtual)
					return false;
			}
			return true;
		});

		gantt.attachEvent("onBeforeParse", function(){
			self.loading = true;
		});

		gantt.attachEvent("onTaskLoading", function(){
			if(self.is_active()){
				self.loaded--;
				if(self.loaded <= 0){
					self.loading = false;
					gantt.eachTask(gantt.bind(function(t){
						this.get_parent(gantt, t);
					}, self));

					gantt._sync_order();
				}
			}
			return true;

		});
		gantt.attachEvent("onParse", function(){
			self.loading = false;
			self.loaded = 0;
		});
	},

	get_parent: function(gantt, task, tasks){
		var group_id = task[this.relation_property];

		if(this._groups_pull[group_id] !== undefined)
			return this._groups_pull[group_id];
		var parent_id = gantt.config.root_id;

		if(!this.loading){
			parent_id = this.find_parent(tasks || gantt.getTaskByTime(), group_id, this.relation_id_property, gantt.config.root_id);
			this._groups_pull[group_id] = parent_id;
		}

		return parent_id;
	},
	find_parent: function(tasks, group_id, relation, root){
		for(var i = 0; i < tasks.length; i++){
			var task = tasks[i];
			if(task[relation] !== undefined && task[relation] == group_id){
				return task.id;
			}
		}
		return root;
	},
	clear: function(){
		this._groups_pull = {};
		this.relation_property = null;
		this.group_id = null;
		this.group_text = null;
	},
	is_active: function(){
		return !!(this.relation_property);
	},
	generate_sections: function(list, groups_type){
		var groups = [];
		for(var i = 0; i < list.length; i++){
			var group = gantt.copy(list[i]);
			group.type = groups_type;
			group.open = true;
			group.$virtual = true;
			group.readonly = true;
			group[this.relation_id_property] = group[this.group_id];
			group.text = group[this.group_text];
			groups.push(group);
		}
		return groups;

	},
	clear_temp_tasks: function(tasks){
		for(var i =0; i < tasks.length; i++){
			if(tasks[i].$virtual){
				tasks.splice(i, 1);
				i--;
			}
		}
	},

	generate_data: function(gantt, groups){
		var links = gantt.getLinks();
		var tasks = gantt.getTaskByTime();

		this.clear_temp_tasks(tasks);

		var categories = [];
		if(this.is_active() && groups && groups.length){
			categories = this.generate_sections(groups, gantt.config.types.project);
		}

		var data = {links: links};
		data.data = categories.concat(tasks);

		return data;
	},
	update_settings: function(relation, group_id, group_text){
		this.clear();
		this.relation_property = relation;
		this.group_id = group_id;
		this.group_text = group_text;
	},
	group_tasks: function (gantt, groups_array, relation_property, group_id, group_text){
		this.update_settings(relation_property, group_id, group_text);
		var data = this.generate_data(gantt, groups_array);
		this.loaded = data.data.length;
		gantt._clear_data();
		gantt.parse(data);
	}
};

gantt._groups.init(gantt);
gantt.groupBy = function(config){
	config = config || {};

	var groups = config.groups || null,
		relation_property = config.relation_property || null,
		group_id = config.group_id||"key",
		group_text = config.group_text||"label";

	this._groups.group_tasks(this, groups, relation_property, group_id, group_text);
};

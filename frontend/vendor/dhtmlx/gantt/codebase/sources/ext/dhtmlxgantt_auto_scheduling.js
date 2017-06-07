/*
@license

dhtmlxGantt v.4.1.19 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
// helpers for building chain of dependencies, used for critical path calculation and for auto scheduling

gantt._formatLink = function(link){
	var relations = [];
	var target = this._get_link_target(link);
	var source = this._get_link_source(link);

	if(!(source && target)){
		return relations;
	}

	if((gantt.isChildOf(source.id, target.id) && gantt._isProject(target)) || (gantt.isChildOf(target.id, source.id) && gantt._isProject(source))){
		return relations;
		
	}


	// there are three kinds of connections at this point
	// task -> task - regular link
	// task -> project - transform it into set of regular links (task -> [each subtask]), use offset beetween subtask and project dates as lag, in order not to change mutual positions of subtasks inside a project
	// project -> task - transform it into ([each subtask] -> task) links
	// project -> project - transform it into ([each subtask of p1] -> [each subtask of p2]) links

	var from = this._getImplicitLinks(link, source, function(c){
		return 0;
	});

	var respectTargetOffset = gantt.config.auto_scheduling_move_projects;
	var targetDates = this._isProject(target) ? this.getSubtaskDates(target.id) : {start_date: target.start_date, end_date: target.end_date};
	var to = this._getImplicitLinks(link, target, function(c){
		if(!respectTargetOffset){
			return 0;
		}else{

			if(!c.$target.length && !(gantt.getState().drag_id == c.id)){// drag_id - virtual lag shouldn't restrict task that is being moved inside project
				return gantt.calculateDuration(gantt.roundDate(targetDates.start_date),gantt.roundDate(c.start_date));
			}else{
				return 0;
			}
		}
	});

	for(var i = 0; i < from.length; i++){
		var fromTask = from[i];
		for(var j = 0; j < to.length; j++){
			var toTask = to[j];

			var lag = fromTask.lag*1 + toTask.lag*1;

			var subtaskLink = {
				id: link.id,
				type: link.type,
				source: fromTask.task,
				target: toTask.task,
				lag: (link.lag*1 || 0) + lag
			};

			relations.push(gantt._convertToFinishToStartLink(toTask.task, subtaskLink, source, target));
		}
	}

	return relations;
};

gantt._getImplicitLinks = function(link, parent, selectOffset){
	var relations = [];
	if(this._isProject(parent)){
		this.eachTask(function(c){
			if(!this._isProject(c))
				relations.push({task: c.id, lag: selectOffset(c)});
		}, parent.id);
	}else{
		relations.push({task:parent.id, lag: 0});
	}

	return relations;
};

gantt._getDirectDependencies = function(task, selectSuccessors){

	var links = [],
		successors = [];

	var linksIds = selectSuccessors ? task.$source : task.$target;

	for(var i = 0; i < linksIds.length; i++){
		var link = this.getLink(linksIds[i]);
		if(this.isTaskExists(link.source) && this.isTaskExists(link.target))
			links.push(this.getLink(linksIds[i]));
	}

	for (var i = 0; i < links.length; i++) {
		successors = successors.concat(this._formatLink(links[i]));
	}

	return successors;
};

gantt._getInheritedDependencies = function(task, selectSuccessors){
	var successors = [];

	var inheritedRelations = [];
	if(this.isTaskExists(task.id)){
		this._eachParent(function(parent){
			if(this._isProject(parent)){
				inheritedRelations.push.apply(inheritedRelations, this._getDirectDependencies(parent, selectSuccessors));
			}
		}, task.id, this);

		for(var i = 0; i < inheritedRelations.length; i++){

			var relProperty = selectSuccessors ? inheritedRelations[i].source : inheritedRelations[i].target;

			if(relProperty == task.id){
				successors.push(inheritedRelations[i]);
			}
		}
	}

	return successors;
};


gantt._getDirectSuccessors = function(task){
	return this._getDirectDependencies(task, true);
};

gantt._getInheritedSuccessors = function(task){
	return this._getInheritedDependencies(task, true);
};

gantt._getDirectPredecessors = function(task){
	return this._getDirectDependencies(task, false);
};

gantt._getInheritedPredecessors = function(task){
	return this._getInheritedDependencies(task, false);
};


gantt._getSuccessors = function(task){
	return this._getDirectSuccessors(task).concat(this._getInheritedSuccessors(task));
};

gantt._getPredecessors = function(task){
	return this._getDirectPredecessors(task).concat(this._getInheritedPredecessors(task));
};


gantt._convertToFinishToStartLink = function(id, link, sourceTask, targetTask){
	// convert finish-to-finish, start-to-finish and start-to-start to finish-to-start link and provide some additional properties
	var res = {
		target: id,
		link: gantt.config.links.finish_to_start,
		id: link.id,
		lag: link.lag || 0,
		source: link.source,
		preferredStart: null
	};

	var additionalLag = 0;
	switch (link.type){
		case gantt.config.links.start_to_start:
			additionalLag = -sourceTask.duration;
			break;
		case gantt.config.links.finish_to_finish:
			additionalLag = -targetTask.duration;
			break;
		case gantt.config.links.start_to_finish:
			additionalLag = -sourceTask.duration-targetTask.duration;
			break;
		default:
			additionalLag = 0;
	}

	res.lag += additionalLag;
	return res;
};


gantt.config.auto_scheduling = false;
gantt.config.auto_scheduling_descendant_links = false;
gantt.config.auto_scheduling_initial = true;
gantt.config.auto_scheduling_strict = false;
gantt.config.auto_scheduling_move_projects = true;

gantt._forEach = function(arr, callback){
	var workArray = arr.slice();
	for(var i = 0; i < workArray.length; i++){
		callback(workArray[i], i);
	}
};
gantt._arrayMap = function(arr, callback){
	var workArray = arr.slice();
	var resArray = [];

	for(var i = 0; i < workArray.length; i++){
		resArray.push(callback(workArray[i], i));
	}

	return resArray;
};

gantt._autoSchedulingGraph = {
	getVertices: function(relations){
		var ids = {};

		gantt._forEach(relations, function(rel){
			ids[rel.target] = rel.target;
			ids[rel.source] = rel.source;
		});

		var vertices = [];
		for(var i in ids){
			vertices.push(ids[i]);
		}

		return vertices.sort(function(a, b){ return gantt.getGlobalTaskIndex(a) - gantt.getGlobalTaskIndex(b);});
	},
	topologicalSort: function(edges){
		var vertices = this.getVertices(edges);
		var hash = {};

		for(var i = 0; i < vertices.length; i ++){
			hash[vertices[i]] = {id: vertices[i], $source:[], $target:[], $incoming: 0};
		}

		for(var i = 0; i < edges.length; i++){
			var successor = hash[edges[i].target];
			successor.$target.push(i);
			successor.$incoming = successor.$target.length;
			hash[edges[i].source].$source.push(i);

		}

		// topological sort, Kahn's algorithm
		var S = vertices.filter(function(v){ return !hash[v].$incoming; });

		var L = [];

		while(S.length){
			var n = S.pop();

			L.push(n);

			var node = hash[n];

			for(var i = 0; i < node.$source.length; i++){
				var m = hash[edges[node.$source[i]].target];
				m.$incoming--;
				if(!m.$incoming){
					S.push(m.id);
				}

			}
		}

		return L;

	},
	tarjanStronglyConnectedComponents: function(vertices, edges){
		//https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
		var verticesHash = {};

		var index = 0;
		var S = [];
		var connectedEdges = [];
		var connectedComponents = [];

		gantt._forEach(vertices, function(vertexId){
			var vertex = getVertex(vertexId);
			if(vertex.index === undefined){
				strongConnect(vertexId);
			}
		});

		function strongConnect(vertexId, previousLink){
			var v = getVertex(vertexId);
			v.index = index;
			v.lowLink = index;
			index++;

			if(previousLink){
				connectedEdges.push(previousLink);
			}

			S.push(v);
			v.onStack = true;

			// Consider successors of v
			gantt._forEach(edges, function(edge){
				if(edge.source != vertexId) return;

				var v = getVertex(edge.source);
				var w = getVertex(edge.target);
				if(w.index === undefined){
					// Successor w has not yet been visited; recurse on it
					strongConnect(edge.target, edge);
					v.lowLink = Math.min(v.lowLink, w.lowLink);
				}else if(w.onStack){
					// Successor w is in stack S and hence in the current SCC
					v.lowLink = Math.min(v.lowLink, w.index);
					connectedEdges.push(edge);
				}

			});

			// If v is a root node, pop the stack and generate an SCC
			if(v.lowLink == v.index){
				var connectedComponent = {tasks: [], links:[]};
				var w;
				do{
					var rel = connectedEdges.pop();
					w = S.pop();
					w.onStack = false;
					connectedComponent.tasks.push(w.id);
					if(rel){
						connectedComponent.links.push(rel.id);
					}
				}while(w.id != v.id);
				connectedComponents.push(connectedComponent);
			}

		}

		return connectedComponents;

		function getVertex(id){
			if(!verticesHash[id]){
				verticesHash[id] = {id: id};
			}

			return verticesHash[id];
		}

	}

};

gantt._autoSchedulingPath = {
	getKey: function(rel){
		return [rel.lag, rel.link, rel.source, rel.target].join("_");
	},
	getVirtualRoot: function(){
		return gantt.mixin(
			gantt.getSubtaskDates(),
			{
				id: gantt.config.root_id,
				type: gantt.config.types.project,
				$source: [],
				$target: [],
				$virtual: true
			}
		);
	},

	filterDuplicates: function(relations){
		var keys = {};
		for(var i = 0; i < relations.length; i++){
			var key = this.getKey(relations[i]);
			if(keys[key]){
				relations.splice(i, 1);
				i--;
			}else{
				keys[key] = true;
			}
		}
		return relations;
	},

	getLinkedTasks: function(id, includePredecessors){
		var startIds = [id];

		var relations = [];
		var visited = {};
		for(var i = 0; i < startIds.length; i++){
			relations = relations.concat(this._getLinkedTasks(startIds[i], visited, includePredecessors));
		}

		return relations;
	},

	_getLinkedTasks: function(rootTask, visitedTasks, includePredecessors){
		var from = rootTask === undefined ? gantt.config.root_id : rootTask;
		var visited = visitedTasks || {};

		var rootObj = gantt.isTaskExists(from) ? gantt.getTask(from) : this.getVirtualRoot();
		var relations = gantt._getSuccessors(rootObj);

		if(includePredecessors){
			relations.push.apply(relations, gantt._getPredecessors(rootObj));
		}

		var chainRelations = [];
		for(var i=0; i < relations.length; i++){

			if(visited[this.getKey(relations[i])])
				continue;
			visited[this.getKey(relations[i])] = true;
			chainRelations = chainRelations.concat(this._getLinkedTasks(relations[i].target, visited, true));
		}

		var children = gantt.getChildren(rootObj.id);
		for(var i=0; i < children.length; i++){
			relations = relations.concat(this._getLinkedTasks(children[i], visited, true));
		}

		return this.filterDuplicates(relations.concat(chainRelations));
	},

	findLoops: function(relations){

		var cycles = [];

		gantt._forEach(relations, function(rel){
			if(rel.target == rel.source)
				cycles.push([rel.target, rel.source]);
		});

		var graph =  gantt._autoSchedulingGraph;
		var vertices = graph.getVertices(relations);

		var connectedComponents = graph.tarjanStronglyConnectedComponents(vertices, relations);

		gantt._forEach(connectedComponents, function(component){
			if(component.tasks.length > 1){
				cycles.push(component);//{ tasks: [task ids], links: [links ids]}
			}
		});

		return cycles;
		//{task:id, link:link.type, lag: link.lag || 0, source: link.source}
	}
};

gantt._autoSchedulingDateResolver = {
	isFirstSmaller: function(small, big){
		if(small.valueOf() < big.valueOf() && gantt._hasDuration(small, big))
			return true;
		return false;
	},

	isSmallerOrDefault: function(smallDate, bigDate){
		return !!(!smallDate || this.isFirstSmaller(smallDate, bigDate));
	},

	resolveRelationDate: function(taskId, relations, getEndDate){
		var minStart = null;
		var linkId = null;

		var defaultStart = null;

		for(var i = 0; i < relations.length; i++){
			var relation = relations[i];
			taskId = relation.target;

			defaultStart = relation.preferredStart;

			var constraintDate = this.getConstraintDate(relation, getEndDate);

			if(this.isSmallerOrDefault(defaultStart, constraintDate) && this.isSmallerOrDefault(minStart, constraintDate)){
				minStart = constraintDate;
				linkId = relation.id;
			}

		}

		return {
			link: linkId,
			task: taskId,
			start_date: minStart
		};
	},
	getConstraintDate: function(relation, getEndDate){
		var new_start = getEndDate(relation.source);

		if(new_start && relation.lag && relation.lag*1 == relation.lag){
			new_start = gantt.calculateEndDate(new_start, relation.lag*1);
		}

		return new_start;
	}
};

gantt._autoSchedulingPlanner = {
	generatePlan: function(relations){

		var graph = gantt._autoSchedulingGraph;
		var orderedIds = graph.topologicalSort(relations);
		var predecessorRelations = {},
			plansHash = {};

		gantt._arrayMap(orderedIds, function(v) {
			var task = gantt.getTask(v);
			if(task.auto_scheduling === false){
				return;
			}

			predecessorRelations[v] = [];
			plansHash[v] = null;
		});

		function getPredecessorEndDate(id){
			var plan = plansHash[id];
			var task = gantt.getTask(id);

			if(!(plan && (plan.start_date || plan.end_date)))
				return gantt.getClosestWorkTime({date:task.end_date, dir:"future"});

			if(plan.end_date){
				return plan.end_date;
			}else{
				return gantt.calculateEndDate(plan.start_date, task.duration, gantt.config.duration_unit);
			}
		}

		for(var i = 0; i < relations.length; i++){
			if(predecessorRelations[relations[i].target]) {
				predecessorRelations[relations[i].target].push(relations[i]);
			}
		}

		var dateResolver = gantt._autoSchedulingDateResolver;

		var result = [];
		for(var i = 0; i < orderedIds.length; i++){
			var currentId = orderedIds[i];

			var plan = dateResolver.resolveRelationDate(currentId, predecessorRelations[currentId] || [], getPredecessorEndDate);


			if(plan.start_date && gantt.isLinkExists(plan.link)){
				var link = gantt.getLink(plan.link);
				var task = gantt.getTask(currentId);
				var predecessor = gantt.getTask(link.source);

				if (task.start_date.valueOf() !== plan.start_date.valueOf() && gantt.callEvent("onBeforeTaskAutoSchedule", [task, plan.start_date, link, predecessor]) === false) {
					continue;
				}
			}

			plansHash[currentId] = plan;
			if(plan.start_date){
				result.push(plan);
			}
		}

		return result;

	},

	applyProjectPlan: function(projectPlan){
		var plan, task, link, predecessor;

		var updateTasks = [];
		for(var i = 0; i <  projectPlan.length; i++){
			link = null;
			predecessor = null;
			plan = projectPlan[i];

			if(!plan.task) continue;

			task = gantt.getTask(plan.task);
			if(plan.link){
				link = gantt.getLink(plan.link);
				predecessor = gantt.getTask(link.source);
			}

			var newDate = null;
			if(plan.start_date && (task.start_date.valueOf() != plan.start_date.valueOf())){
				newDate = plan.start_date;
			}

			if(!newDate) continue;
			
			task.start_date = newDate;
			task.end_date = gantt.calculateEndDate(task.start_date, task.duration, gantt.config.duration_unit);

			updateTasks.push(task.id);
			gantt.callEvent("onAfterTaskAutoSchedule", [task, newDate, link, predecessor]);

		}
		return updateTasks;
	}
};

gantt._autoSchedulingPreferredDates = function(startTask, relations){
	for(var i = 0; i < relations.length; i++){
		var rel = relations[i];
		var task = gantt.getTask(rel.target);

		if(!gantt.config.auto_scheduling_strict || rel.target == startTask){
			rel.preferredStart = new Date(task.start_date);
		}
	}
};

gantt._autoSchedule = function(id, relations, updateCallback){
	if (gantt.callEvent("onBeforeAutoSchedule", [id]) === false) {
		return;
	}
	gantt._autoscheduling_in_progress = true;

	var path = gantt._autoSchedulingPath;

	var updatedTasks = [];

	var cycles = path.findLoops(relations);
	if(cycles.length){
		gantt.callEvent("onAutoScheduleCircularLink", [cycles]);
	}else{

		var planner = gantt._autoSchedulingPlanner;
		gantt._autoSchedulingPreferredDates(id, relations);

		var plan = planner.generatePlan(relations);
		updatedTasks = planner.applyProjectPlan(plan);

		if(updateCallback){
			updateCallback(updatedTasks);
		}
	}

	gantt._autoscheduling_in_progress = false;
	gantt.callEvent("onAfterAutoSchedule", [id, updatedTasks]);

	return updatedTasks;
};

gantt.autoSchedule = function(id, inclusive){

	if(inclusive === undefined){
		inclusive = true;
	}else{
		inclusive = !!inclusive;
	}
	var relations =  gantt._autoSchedulingPath.getLinkedTasks(id, inclusive);
	gantt._autoSchedule(id, relations, gantt._finalizeAutoSchedulingChanges);
};

gantt._finalizeAutoSchedulingChanges = function(updatedTasks){

	gantt.batchUpdate(function(){
		for(var i = 0; i < updatedTasks.length; i++){
			gantt.updateTask(updatedTasks[i]);
		}
	});

};

gantt.isCircularLink = function(link){
	return !!gantt._getConnectedGroup(link);

};

gantt._getConnectedGroup = function(link){
	var manager = gantt._autoSchedulingPath;

	var allRelations = manager.getLinkedTasks();
	if(!gantt.isLinkExists(link.id)){
		allRelations = allRelations.concat(gantt._formatLink(link));
	}

	var cycles = manager.findLoops(allRelations);

	var found = false;
	for(var i = 0; (i < cycles.length) && !found; i++){
		var links = cycles[i].links;
		for(var j = 0; j < links.length; j++){
			if(links[j] == link.id){
				return cycles[i];
			}
		}
	}

	return null;
};

gantt.findCycles = function(){
	var manager = gantt._autoSchedulingPath;

	var allRelations = manager.getLinkedTasks();
	return manager.findLoops(allRelations);
};

gantt._attachAutoSchedulingHandlers = function(){

	gantt._autoScheduleAfterLinkChange = function (linkId, link) {
		if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
			gantt.autoSchedule(link.source);
		}
	};

	gantt.attachEvent("onAfterLinkUpdate", gantt._autoScheduleAfterLinkChange);
	gantt.attachEvent("onAfterLinkAdd", gantt._autoScheduleAfterLinkChange);

	gantt.attachEvent("onParse", function(){
		if (gantt.config.auto_scheduling && gantt.config.auto_scheduling_initial) {
			gantt.autoSchedule();
		}
	});

	gantt._preventCircularLink = function(id, link){
		if(gantt.isCircularLink(link)){
			gantt.callEvent("onCircularLinkError", [link, gantt._getConnectedGroup(link)]);
			return false;
		}else{
			return true;
		}
	};

	gantt._preventDescendantLink = function(id, link){
		var source = gantt.getTask(link.source),
			target = gantt.getTask(link.target);

		if(!gantt.config.auto_scheduling_descendant_links){
			if((gantt.isChildOf(source.id, target.id) && gantt._isProject(target)) || (gantt.isChildOf(target.id, source.id) && gantt._isProject(source))){
				return false;
			}
		}
		return true;
	};

	gantt.attachEvent("onBeforeLinkAdd", gantt._preventCircularLink);
	gantt.attachEvent("onBeforeLinkAdd", gantt._preventDescendantLink);
	gantt.attachEvent("onBeforeLinkUpdate", gantt._preventCircularLink);
	gantt.attachEvent("onBeforeLinkUpdate", gantt._preventDescendantLink);

	gantt._datesNotEqual = function(dateA, dateB){
		if(dateA.valueOf() > dateB.valueOf()){
			return this._hasDuration(dateB, dateA);
		}else{
			return this._hasDuration(dateA, dateB);
		}
	};
	gantt._notEqualTaskDates = function(task1, task2){
		if (this._datesNotEqual(task1.start_date, task2.start_date) ||
			((this._datesNotEqual(task1.end_date, task2.end_date) ||
				task1.duration != task2.duration) && task1.type != gantt.config.types.milestone)) {
			return true;
		}
	};

	var relations;
	var movedTask;
	gantt.attachEvent("onBeforeTaskDrag", function(id, mode, task){
		if(gantt.config.auto_scheduling_move_projects){
			// collect relations before drag and drop  in order to have original positions of subtasks within project since they are used as lag when moving dependent project
			relations = gantt._autoSchedulingPath.getLinkedTasks(id, true);
			movedTask = id;
		}
		return true;
	});
	gantt._autoScheduleAfterDND = function(taskId, task){
		if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
			var newTask = this.getTask(taskId);
			if (gantt._notEqualTaskDates(task, newTask)){
				if(gantt.config.auto_scheduling_move_projects && movedTask == taskId){
					gantt._autoSchedule(taskId, relations, gantt._finalizeAutoSchedulingChanges);
				}else{
					gantt.autoSchedule(newTask.id);
				}


			}
		}
		relations = null;
		movedTask = null;
		return true;
	};

	gantt._lightBoxChangesHandler = function (taskId, task) {
		if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
			var oldTask = this.getTask(taskId);
			if (gantt._notEqualTaskDates(task, oldTask)) {
				gantt._autoschedule_lightbox_id = taskId;
			}
		}
		return true;
	};
	gantt._lightBoxSaveHandler = function (taskId, task) {

		if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
			if (gantt._autoschedule_lightbox_id && gantt._autoschedule_lightbox_id == taskId) {
				gantt._autoschedule_lightbox_id = null;
				gantt.autoSchedule(task.id);
			}
		}
		return true;
	};




	gantt.attachEvent("onBeforeTaskChanged", function(id, mode, task){ return gantt._autoScheduleAfterDND(id, task); });
	gantt.attachEvent("onLightboxSave", gantt._lightBoxChangesHandler);
	gantt.attachEvent("onAfterTaskUpdate", gantt._lightBoxSaveHandler);


};

gantt.attachEvent("onGanttReady", function(){
	gantt._attachAutoSchedulingHandlers();
});
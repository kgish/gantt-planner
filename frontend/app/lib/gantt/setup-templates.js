export default function (gantt) {
    // Highlight weekends
    gantt.templates.task_cell_class = function(task, date){
        if (gantt.config.scale_unit === 'day') {
            let day = date.getDay();
            return day === 0 || day === 6 ? 'week_end' : '';
        } else {
            return '';
        }
	};

    // Tooltips
    gantt.templates.tooltip_text = function (start, end, task) {
        let tooltip = '',
            task_type = task.parent === "0" ? 'Project' : 'Task';

        tooltip += '<b>Id</b> : ' + task.id + '<br/>';
        tooltip += '<b>Type</b> : ' + task_type + '<br/>';
        tooltip += '<b>Name</b> : ' + task.text + '<br/>';
        tooltip += '<b>Start date</b> : ' + gantt.templates.tooltip_date_format(start) + '<br/>';
        tooltip += '<b>End date</b> : ' + gantt.templates.tooltip_date_format(end) + '<br/>';
        tooltip += '<b>Duration</b> : ' + task.duration + '<br/>';
        tooltip += '<b>Progress</b> : ' + parseInt(task.progress * 100) + '%<br/>';
        tooltip += '<b>Source</b> : [' + task.$source.join(',') + ']<br/>';
        tooltip += '<b>Target</b> : [' + task.$target.join(',') + ']<br/>';

        return tooltip;
    };

    // Task class
	gantt.templates.task_class = function (start, end, task) {
        let progress = task.progress * 100,
            classes = [];

        // Colorize task depending on progress: pending, started or completed.
        if (progress >= 100) {
            classes.push('completed');
        } else if (progress > 0) {
            classes.push('started');
        } else {
            classes.push('pending');
        }
        return classes.join(' ');
	};

    // Disable progress text on task bar
	gantt.templates.progress_text = function(/*start, end, task*/) {
        return '';
	};

    // Left-side text of task bar
	gantt.templates.leftside_text = function(start, end, task) {
        return parseInt(task.progress * 100) + '%';
    };

	// Right-side text of task bar
	gantt.templates.rightside_text = function(start, end/*, task*/) {
        return gantt.templates.tooltip_date_format(end);
    };
}

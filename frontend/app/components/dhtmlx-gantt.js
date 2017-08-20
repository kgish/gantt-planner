import Ember from 'ember';

import ganttAttachEvents from '../lib/gantt/attach-events';
import ganttSetupConfig from '../lib/gantt/setup-config';
import ganttSetupMarkers from '../lib/gantt/setup-markers';
import ganttSetupTemplates from '../lib/gantt/setup-templates';

export default Ember.Component.extend({
    classNames: ['dhtmlx-gantt'],
    cid: null,
    tasks: null,

    scale_units: [
        { scale_unit: 'Day',     date_scale: '%j %F' },
        { scale_unit: 'Week',    date_scale: 'Week %W' },
        { scale_unit: 'Quarter', date_scale: '%F %Y' },
        { scale_unit: 'Month',   date_scale: '%F %Y' },
        { scale_unit: 'Year',    date_scale: '%Y' }
    ],
    current_scale_unit: 'Day',

    filter_status: [ 'All', 'Pending', 'Started', 'Completed' ],
    current_filter_status: 'All',

    didInsertElement() {
        let dhtmlx_gantt = this.get('classNames')[0];
        this.set('cid', $('.' + dhtmlx_gantt).attr('id'));
        ganttAttachEvents(gantt, this);
        ganttSetupConfig(gantt);
        ganttSetupTemplates(gantt);
    },

    didRender() {
        let dhtmlx_gantt = this.get('classNames')[0],
            len = $('#' + dhtmlx_gantt).length;
        if (len === 0) {
            let cid = this.get('cid'),
                sel_gantt_chart = '#'+cid,
                gantt_chart = $(sel_gantt_chart),
                tasks = this.get('tasks');

            gantt_chart.append('<div id="' + dhtmlx_gantt + '"></div>');

            gantt.init(dhtmlx_gantt);
            gantt.parse(tasks);

            ganttSetupMarkers(gantt);

            // Bug: force render to display markers.
            setTimeout(function(){
                $('button:contains(Week)').click();
                $('button:contains(Day)').click();
            }, 500);
        }
    },

    actions: {
        scale(unit) {
            this.set('current_scale_unit', unit.scale_unit);
            gantt.config.scale_unit = unit.scale_unit.toLowerCase();
            gantt.config.date_scale = unit.date_scale;
            gantt.parse(this.get('tasks'));
        },
        filter(status) {
            this.set('current_filter_status', status);
            gantt.parse(this.get('tasks'));
        },
        save() {

        }
    }
});

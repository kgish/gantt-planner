/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
import Ember from 'ember';
import SaveModelMixin from 'frontend/mixins/projects/save-model-mixin';

export default Ember.Route.extend(SaveModelMixin, {

    model(params) {
        return Ember.RSVP.hash({
            project: this.get('store').findRecord('project', params.project_id),
            tasks: this.get('store').query('task', { project: params.project_id }),
            links: this.get('store').query('link', { project: params.project_id })
        });
    },

    setupController(controller, models){
        let project = models.project,
            tasks = models.tasks,
            links = models.links,
            gantt_tasks = { data: [], links: [] };
        if (project) {
            let entry = {
                id:         project.get('id'),
                text:       project.get('text'),
                start_date: moment(project.get('start_date')).format('DD-MM-YYYY'),
                duration:   project.get('duration'),
                parent:     '0',
                progress:   project.get('progress'),
                open:       true
            };
            console.log('project='+JSON.stringify(entry));
            gantt_tasks.data.push(entry);
            if (tasks && tasks.length) {
                tasks.forEach(task => {
                    let entry = {
                        id:         task.get('id'),
                        text:       task.get('text'),
                        start_date: moment(task.get('start_date')).format('DD-MM-YYYY'),
                        duration:   task.get('duration'),
                        parent:     task.get('parent'),
                        progress:   task.get('progress'),
                        open:       true

                    };
                    console.log('task='+JSON.stringify(entry));
                    gantt_tasks.data.push(entry);
                });
            }

            if (links && links.length) {
                links.forEach(link => {
                    let entry = {
                        id:      link.get('id'),
                        source:  link.get('source'),
                        target:  link.get('target'),
                        type:    link.get('code')
                    };
                    console.log('link='+JSON.stringify(link));
                    gantt_tasks.links.push(entry);
                });
            }
         }

        controller.set('tasks', gantt_tasks);
    }
});

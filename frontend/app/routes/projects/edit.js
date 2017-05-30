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
            gantt_tasks.data.push({
                id:         project.get('id').toString(),
                text:       project.get('text'),
                start_date: moment(project.get('start_date')).format('DD-MM-YYYY'),
                duration:   project.get('duration'),
                parent:     '0',
                progress:   project.get('progress'),
                open:       true

            });
            if (tasks && tasks.length) {
                tasks.forEach(task => {
                    gantt_tasks.data.push({
                        id:         task.get('id').toString(),
                        text:       task.get('text'),
                        start_date: moment(task.get('start_date')).format('DD-MM-YYYY'),
                        duration:   task.get('duration'),
                        parent:     task.get('parent').toString(),
                        progress:   task.get('progress'),
                        open:       true
                    });
                });
            }

            if (links && links.length) {
                links.forEach(link => {
                    gantt_tasks.links.push({
                        id:      link.get('id').toString(),
                        source:  link.get('source').toString(),
                        target:  link.get('target').toString(),
                        type:    link.get('code')
                    });
                });
            }
         }

        controller.set('tasks', gantt_tasks);
    }
});

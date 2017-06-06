export default function () {
    gantt.config.scale_unit = 'day';
    gantt.config.date_scale = '%j %F';

    // -- CONFIG -- //
    //gantt.config.readonly = true;
    //gantt.config.task_height = 16;
    //gantt.config.row_height = 40;

    // This is the default format.
    gantt.config.xml_date="%d-%m-%Y";

    // Default columns definition
    gantt.config.columns = [
        { name: "text",       label: "Task name",  width: "*", tree: true },
        { name: "start_date", label: "Start time", align: "center" },
        { name: "duration",   label: "Duration",   align: "center" },
        { name: "add",        label: "",           width: 44 }
    ];

    // Optimizations
    gantt.config.smart_rendering = true;
    gantt.config.smart_scales = true;
    gantt.config.show_progress = false;
    //gantt.config.show_task_cells = false;
}

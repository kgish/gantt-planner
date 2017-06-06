export default function (gantt) {
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
        { name: "text",       label: "Name",  width: "*", tree: true },
        { name: "start_date", label: "Start", align: "center" },
        { name: "duration",   label: "Days",  align: "center" },
        { name: "add",        label: "",      width: 44 }
    ];

    // Optimizations
    // gantt.config.smart_rendering = true;
    gantt.config.smart_scales = true;
    gantt.config.show_progress = true;
    //gantt.config.show_task_cells = false;
}

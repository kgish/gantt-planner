export default function (gantt) {
    // Add today and finish markers
    let date_to_str = gantt.date.date_to_str(gantt.config.task_date),
        today = new Date(),
        enddate = null;

    gantt.eachTask(function(task) {
        if (enddate === null) {
            if (task.parent === "0") {
                enddate = task.end_date;
            }
        }
    });

    // Today marker
    gantt.addMarker({
        start_date: today,
        css: "today",
        text: "Today",
        title:"Today: "+ date_to_str(today)
    });

    // Finish marker
    if (enddate !== null) {
        gantt.addMarker({
            start_date: enddate,
            css: "finish",
            text: "Finish",
            title:"Finish: "+ date_to_str(enddate)
        });
    }
}

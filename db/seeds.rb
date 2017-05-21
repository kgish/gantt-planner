Task.delete_all
Link.delete_all

project = Task.create!(
  { text: "Project #1", start_date: Date.new(2017, 6,  2), duration: 12, progress: 0.6, parent: nil, topmost: nil }
)

[
  { text: "Task #1",    start_date: Date.new(2017, 6,  3), duration:  5, progress: 1.0, parent: 'Project #1', topmost: 'Project #1' },
  { text: "Task #2",    start_date: Date.new(2017, 6,  3), duration: 11, progress: 0.5, parent: 'Project #1', topmost: 'Project #1' },
  { text: "Task #3",    start_date: Date.new(2017, 6,  2), duration:  6, progress: 0.8, parent: 'Project #1', topmost: 'Project #1' },
  { text: "Task #4",    start_date: Date.new(2017, 6,  3), duration:  5, progress: 0.2, parent: 'Project #1', topmost: 'Project #1' },
  { text: "Task #5",    start_date: Date.new(2017, 6,  2), duration:  7, progress: 0.0, parent: 'Project #1', topmost: 'Project #1' },
  { text: "Task #2.1",  start_date: Date.new(2017, 6,  3), duration:  2, progress: 1.0, parent: 'Task #2',    topmost: 'Project #1' },
  { text: "Task #2.2",  start_date: Date.new(2017, 6,  6), duration:  3, progress: 0.8, parent: 'Task #2',    topmost: 'Project #1' },
  { text: "Task #2.3",  start_date: Date.new(2017, 6, 10), duration:  4, progress: 0.2, parent: 'Task #2',    topmost: 'Project #1' },
  { text: "Task #2.4",  start_date: Date.new(2017, 6, 10), duration:  4, progress: 0.0, parent: 'Task #2',    topmost: 'Project #1' },
  { text: "Task #4.1",  start_date: Date.new(2017, 6,  3), duration:  4, progress: 0.5, parent: 'Task #4',    topmost: 'Project #1' },
  { text: "Task #4.2",  start_date: Date.new(2017, 6,  3), duration:  4, progress: 0.1, parent: 'Task #4',    topmost: 'Project #1' },
  { text: "Task #4.3",  start_date: Date.new(2017, 6,  3), duration:  5, progress: 0.0, parent: 'Task #4',    topmost: 'Project #1' }
].each do |t|
  t[:project_id] = project.id
  task = Task.create!(t)
  project.subtasks << task
end

[
  { source: 11, target: 12, code: 1 },
  { source: 11, target: 13, code: 1 },
  { source: 11, target: 14, code: 1 },
  { source: 11, target: 15, code: 1 },
  { source: 11, target: 16, code: 1 },
  { source: 13, target: 17, code: 1 },
  { source: 17, target: 18, code: 0 },
  { source: 18, target: 19, code: 0 },
  { source: 19, target: 20, code: 0 },
  { source: 15, target: 21, code: 2 },
  { source: 15, target: 22, code: 2 },
  { source: 15, target: 23, code: 2 }
].each do |l|
  project_id = l[:project_id]
  project = Project.find_by!(project_id: project_id)
  l[:project_id] = project.id
  link = Link.create!(l)
  project.links << link
end
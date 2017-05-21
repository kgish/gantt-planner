Project.delete_all
[
    { project_id: 11, text: "Project #1", start_date: Date.new(2017, 4,  2), duration: 12, progress: 0.6 },
].each do |project|
  Project.create!(project)
end

Task.delete_all
[
  # validates :task_id, :text, :start_date, :duration, :progress, :parent_id, presence: :true
  { task_id: 12, text: "Task #1",    start_date: Date.new(2017, 4,  3), duration:  5, parent_id: 11, progress: 1.0, project_id: 11 },
  { task_id: 13, text: "Task #2",    start_date: Date.new(2017, 4,  3), duration: 11, parent_id: 11, progress: 0.5, project_id: 11 },
  { task_id: 14, text: "Task #3",    start_date: Date.new(2017, 4,  2), duration:  6, parent_id: 11, progress: 0.8, project_id: 11 },
  { task_id: 15, text: "Task #4",    start_date: Date.new(2017, 4,  3), duration:  5, parent_id: 11, progress: 0.2, project_id: 11 },
  { task_id: 16, text: "Task #5",    start_date: Date.new(2017, 4,  2), duration:  7, parent_id: 11, progress: 0.0, project_id: 11 },
  { task_id: 17, text: "Task #2.1",  start_date: Date.new(2017, 4,  3), duration:  2, parent_id: 13, progress: 1.0, project_id: 11 },
  { task_id: 18, text: "Task #2.2",  start_date: Date.new(2017, 4,  6), duration:  3, parent_id: 13, progress: 0.8, project_id: 11 },
  { task_id: 19, text: "Task #2.3",  start_date: Date.new(2017, 4, 10), duration:  4, parent_id: 13, progress: 0.2, project_id: 11 },
  { task_id: 20, text: "Task #2.4",  start_date: Date.new(2017, 4, 10), duration:  4, parent_id: 13, progress: 0.0, project_id: 11 },
  { task_id: 21, text: "Task #4.1",  start_date: Date.new(2017, 4,  3), duration:  4, parent_id: 15, progress: 0.5, project_id: 11 },
  { task_id: 22, text: "Task #4.2",  start_date: Date.new(2017, 4,  3), duration:  4, parent_id: 15, progress: 0.1, project_id: 11 },
  { task_id: 23, text: "Task #4.3",  start_date: Date.new(2017, 4,  3), duration:  5, parent_id: 15, progress: 0.0, project_id: 11 }
].each do |t|
  project_id = t[:project_id]
  project = Project.find_by!(project_id: project_id)
  t[:project_id] = project.id
  task = Task.create!(t)
  project.tasks << task
end

Link.delete_all
[
  { link_id: 10, source_id: 11, target_id: 12, code: 1, project_id: 11 },
  { link_id: 11, source_id: 11, target_id: 13, code: 1, project_id: 11 },
  { link_id: 12, source_id: 11, target_id: 14, code: 1, project_id: 11 },
  { link_id: 13, source_id: 11, target_id: 15, code: 1, project_id: 11 },
  { link_id: 14, source_id: 11, target_id: 16, code: 1, project_id: 11 },
  { link_id: 15, source_id: 13, target_id: 17, code: 1, project_id: 11 },
  { link_id: 16, source_id: 17, target_id: 18, code: 0, project_id: 11 },
  { link_id: 17, source_id: 18, target_id: 19, code: 0, project_id: 11 },
  { link_id: 18, source_id: 19, target_id: 20, code: 0, project_id: 11 },
  { link_id: 19, source_id: 15, target_id: 21, code: 2, project_id: 11 },
  { link_id: 20, source_id: 15, target_id: 22, code: 2, project_id: 11 },
  { link_id: 21, source_id: 15, target_id: 23, code: 2, project_id: 11 }
].each do |l|
  project_id = l[:project_id]
  project = Project.find_by!(project_id: project_id)
  l[:project_id] = project.id
  link = Link.create!(l)
  project.links << link
end
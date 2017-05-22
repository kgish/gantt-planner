Task.delete_all
Link.delete_all

project = Task.create!(
  { text: "Project #1", start_date: Date.new(2017, 6,  2), duration: 12, progress: 0.6, parent_id: 0, project_id: 0 }
)

puts "Project=#{project.inspect}"

[
  { text: "Task #1",    start_date: Date.new(2017, 6,  3), duration:  5, progress: 1.0, parent_id: 'Project #1', project_id: 'Project #1' },
  { text: "Task #2",    start_date: Date.new(2017, 6,  3), duration: 11, progress: 0.5, parent_id: 'Project #1', project_id: 'Project #1' },
  { text: "Task #3",    start_date: Date.new(2017, 6,  2), duration:  6, progress: 0.8, parent_id: 'Project #1', project_id: 'Project #1' },
  { text: "Task #4",    start_date: Date.new(2017, 6,  3), duration:  5, progress: 0.2, parent_id: 'Project #1', project_id: 'Project #1' },
  { text: "Task #5",    start_date: Date.new(2017, 6,  2), duration:  7, progress: 0.0, parent_id: 'Project #1', project_id: 'Project #1' },
  { text: "Task #2.1",  start_date: Date.new(2017, 6,  3), duration:  2, progress: 1.0, parent_id: 'Task #2',    project_id: 'Project #1' },
  { text: "Task #2.2",  start_date: Date.new(2017, 6,  6), duration:  3, progress: 0.8, parent_id: 'Task #2',    project_id: 'Project #1' },
  { text: "Task #2.3",  start_date: Date.new(2017, 6, 10), duration:  4, progress: 0.2, parent_id: 'Task #2',    project_id: 'Project #1' },
  { text: "Task #2.4",  start_date: Date.new(2017, 6, 10), duration:  4, progress: 0.0, parent_id: 'Task #2',    project_id: 'Project #1' },
  { text: "Task #4.1",  start_date: Date.new(2017, 6,  3), duration:  4, progress: 0.5, parent_id: 'Task #4',    project_id: 'Project #1' },
  { text: "Task #4.2",  start_date: Date.new(2017, 6,  3), duration:  4, progress: 0.1, parent_id: 'Task #4',    project_id: 'Project #1' },
  { text: "Task #4.3",  start_date: Date.new(2017, 6,  3), duration:  5, progress: 0.0, parent_id: 'Task #4',    project_id: 'Project #1' }
].each do |t|
  puts "Task=#{t.inspect}"
  t[:parent_id] = Task.find_by!(text: t[:parent_id]).id
  t[:project_id] = Task.find_by!(text: t[:project_id]).id
  task = Task.create!(t)
  puts "Task=#{task.inspect}"
end

[
  { source_id: 'Project #1', target_id: 'Task #1',   code: 1, project_id: 'Project #1' },
  { source_id: 'Project #1', target_id: 'Task #2',   code: 1, project_id: 'Project #1' },
  { source_id: 'Project #1', target_id: 'Task #3',   code: 1, project_id: 'Project #1' },
  { source_id: 'Project #1', target_id: 'Task #4',   code: 1, project_id: 'Project #1' },
  { source_id: 'Project #1', target_id: 'Task #5',   code: 1, project_id: 'Project #1' },
  { source_id: 'Task #2',    target_id: 'Task #2.1', code: 1, project_id: 'Project #1' },
  { source_id: 'Task #2.1',  target_id: 'Task #2.2', code: 0, project_id: 'Project #1' },
  { source_id: 'Task #2.2',  target_id: 'Task #2.3', code: 0, project_id: 'Project #1' },
  { source_id: 'Task #2.3',  target_id: 'Task #2.4', code: 0, project_id: 'Project #1' },
  { source_id: 'Task #4',    target_id: 'Task #4.1', code: 2, project_id: 'Project #1' },
  { source_id: 'Task #4',    target_id: 'Task #4.2', code: 2, project_id: 'Project #1' },
  { source_id: 'Task #4',    target_id: 'Task #4.3', code: 2, project_id: 'Project #1' }
].each do |l|
  l[:source_id] = Task.find_by!(text: l[:source_id]).id
  l[:target_id] = Task.find_by!(text: l[:target_id]).id
  l[:project_id] = Task.find_by!(text: l[:project_id]).id
  link = Link.create!(l)
  puts "Link=#{link.inspect}"
end
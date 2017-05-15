Task.delete_all
[
  { text: "Project #1", start_date: Date.new(2017, 4,  2), duration: 12, parent: 0,  progress: 0.6 },
  { text: "Task #1",    start_date: Date.new(2017, 4,  3), duration:  5, parent: 11, progress: 1.0 },
  { text: "Task #2",    start_date: Date.new(2017, 4,  3), duration: 11, parent: 11, progress: 0.5 },
  { text: "Task #3",    start_date: Date.new(2017, 4,  2), duration:  6, parent: 11, progress: 0.8 },
  { text: "Task #4",    start_date: Date.new(2017, 4,  3), duration:  5, parent: 11, progress: 0.2 },
  { text: "Task #5",    start_date: Date.new(2017, 4,  2), duration:  7, parent: 11, progress: 0.0 },
  { text: "Task #2.1",  start_date: Date.new(2017, 4,  3), duration:  2, parent: 13, progress: 1.0 },
  { text: "Task #2.2",  start_date: Date.new(2017, 4,  6), duration:  3, parent: 13, progress: 0.8 },
  { text: "Task #2.3",  start_date: Date.new(2017, 4, 10), duration:  4, parent: 13, progress: 0.2 },
  { text: "Task #2.4",  start_date: Date.new(2017, 4, 10), duration:  4, parent: 13, progress: 0.0 },
  { text: "Task #4.1",  start_date: Date.new(2017, 4,  3), duration:  4, parent: 15, progress: 0.5 },
  { text: "Task #4.2",  start_date: Date.new(2017, 4,  3), duration:  4, parent: 15, progress: 0.1 },
  { text: "Task #4.3",  start_date: Date.new(2017, 4,  3), duration:  5, parent: 15, progress: 0.0 }
].each do |task|
  Task.create!(task)
end

Link.delete_all
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
].each do |link|
  Link.create!(link)
end
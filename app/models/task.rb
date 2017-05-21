class Task < ApplicationRecord
  validates :text, :start_date, :duration, :progress, :parent, :topmost, presence: :true

  belongs_to :parent, class_name: 'Task'
  belongs_to :topmost, class_name: 'Task'

  has_many :subtasks, class_name: 'Task'
  has_many :links
end

class Task < ApplicationRecord
  validates :task_id, :text, :start_date, :duration, :progress, :parent_id, presence: :true

  belongs_to :project
end

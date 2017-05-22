class Task < ApplicationRecord
  validates :text, :start_date, :duration, :progress, :parent_id, :project_id, presence: true

end

class Task < ApplicationRecord
  validates :text, :start_date, :duration, :progress, :parent, :project, presence: true
end

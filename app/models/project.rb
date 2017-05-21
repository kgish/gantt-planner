class Project < ApplicationRecord
  validates :project_id, :text, :start_date, :duration, :progress, presence: :true

  has_many :tasks
  has_many :links
end

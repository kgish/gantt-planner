class Task < ApplicationRecord
  validates :text, :start_date, :duration, :progress, :parent, presence: :true
end

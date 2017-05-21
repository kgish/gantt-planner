class Link < ApplicationRecord
  validates :source, :target, presence: true
  validates_inclusion_of :code, :in => [ 0, 1, 2, 3 ]

  belongs_to :source, class_name: 'Task'
  belongs_to :target, class_name: 'Task'
end

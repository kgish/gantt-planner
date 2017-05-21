class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.integer :link_id
      t.integer :source_id
      t.integer :target_id
      t.integer :code
      t.belongs_to :project
    end
  end
end
